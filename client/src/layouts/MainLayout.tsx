/**
 * 主布局组件
 */

import { Layout, Menu, Avatar, Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  SafetyCertificateOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { usePermission } from '../contexts/PermissionContext';

const { Header, Sider, Content } = Layout;

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { can } = usePermission();

  const allMenuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
      permission: null, // 所有人可见
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
      permission: { action: 'read', subject: 'User' },
    },
    {
      key: '/permissions',
      icon: <SafetyCertificateOutlined />,
      label: '权限管理',
      permission: { action: 'read', subject: 'Role' },
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
      permission: { action: 'manage', subject: 'Settings' },
      children: [
        {
          key: '/database',
          icon: <FileTextOutlined />,
          label: '数据库管理',
        },
      ],
    },
  ];

  // 根据权限过滤菜单（支持子菜单）
  const filterMenuItems = (items: any[]): any[] => {
    return items
      .filter((item) => {
        // 如果没有权限要求，所有人都可见
        if (!item.permission) return true;
        // 检查权限
        return can(item.permission.action, item.permission.subject);
      })
      .map((item) => {
        // 如果有子菜单，递归过滤子菜单
        if (item.children) {
          const filteredChildren = filterMenuItems(item.children);
          // 如果子菜单过滤后为空，返回 null（后续会过滤掉）
          if (filteredChildren.length === 0) return null;
          return { ...item, children: filteredChildren };
        }
        return item;
      })
      .filter(Boolean); // 过滤掉 null 值
  };

  const menuItems = filterMenuItems(allMenuItems);

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  // 获取用户信息
  const getUserInfo = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (error) {
      console.error('获取用户信息失败', error);
    }
    return null;
  };

  const userInfo = getUserInfo();
  const username = userInfo?.username || '用户';

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserSwitchOutlined />,
      label: '个人资料',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          background: '#001529',
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: collapsed ? '16px' : '18px',
          fontWeight: 'bold',
        }}>
          Trae
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['/dashboard']}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <span>{username}</span>
              <Avatar icon={<UserOutlined />} />
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#f0f2f5',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
