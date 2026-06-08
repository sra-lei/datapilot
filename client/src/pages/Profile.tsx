/**
 * 个人资料页面
 */

import { Card, Descriptions, Tag, Space, Button, message } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface UserInfo {
  id: number;
  username: string;
  email: string | null;
  created_at?: string;
}

function Profile() {
  const navigate = useNavigate();

  // 从 localStorage 获取用户信息
  const getUserInfo = (): UserInfo | null => {
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

  // 从 localStorage 获取用户角色
  const getUserRoles = (): string[] => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.roles || [];
      }
    } catch (error) {
      console.error('获取用户角色失败', error);
    }
    return [];
  };

  const userInfo = getUserInfo();
  const roles = getUserRoles();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    message.success('已退出登录');
    navigate('/login');
  };

  if (!userInfo) {
    return (
      <Card>
        <Space direction="vertical" style={{ width: '100%' }}>
          <p>未找到用户信息</p>
          <Button type="primary" onClick={() => navigate('/login')}>
            去登录
          </Button>
        </Space>
      </Card>
    );
  }

  return (
    <Card
      title={
        <Space>
          <UserOutlined />
          个人资料
        </Space>
      }
      extra={
        <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
          退出登录
        </Button>
      }
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="用户ID">{userInfo.id}</Descriptions.Item>
        <Descriptions.Item label="用户名">{userInfo.username}</Descriptions.Item>
        <Descriptions.Item label="邮箱">
          {userInfo.email || <Tag color="default">未设置</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="角色">
          <Space>
            {roles.map((role) => (
              <Tag key={role} color="blue">
                {role}
              </Tag>
            ))}
          </Space>
        </Descriptions.Item>
        {userInfo.created_at && (
          <Descriptions.Item label="注册时间">
            {new Date(userInfo.created_at).toLocaleString('zh-CN')}
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
}

export default Profile;
