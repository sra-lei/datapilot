/**
 * 仪表盘页面
 */

import { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Button, message } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { checkHealth, changePassword } from '../services/user';
import type { ApiResponse } from '../services/types';

function Dashboard() {
  const [healthStatus, setHealthStatus] = useState('checking...');
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    checkHealth()
      .then((data) => setHealthStatus(data.data?.status || 'offline'))
      .catch(() => setHealthStatus('offline'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
    message.success('已退出登录');
  };

  const handleChangePassword = async() => {
    const username = user?.username || '';
    const oldPassword = prompt('请输入旧密码');
    const newPassword = prompt('请输入新密码');

    if (!oldPassword || !newPassword) {
      message.warning('请输入完整信息');
      return;
    }

    try {
      const result: ApiResponse = await changePassword({
        username,
        oldPassword,
        newPassword,
      });

      if (result.code === 200) {
        message.success(result.message);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('修改失败，请重试');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="系统状态"
              value={healthStatus}
              valueStyle={{ color: healthStatus === 'ok' ? '#52c41a' : '#ff4d4f' }}
              prefix={<SettingOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="当前用户"
              value={user?.username || '未登录'}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="功能模块"
              value={3}
              suffix="个"
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="操作"
              value={2}
              suffix="项"
              prefix={<Button.Group>
                <Button onClick={handleChangePassword} type="primary" size="small">
                  修改密码
                </Button>
                <Button onClick={handleLogout} danger size="small">
                  <LogoutOutlined />
                </Button>
              </Button.Group>}
            />
          </Card>
        </Col>
      </Row>

      <Card title="欢迎使用 Trae 管理系统" style={{ marginTop: 24 }}>
        <p>这是一个基于 Ant Design Pro 的管理后台系统。</p>
        <p>当前已实现功能：</p>
        <ul>
          <li>用户登录/注册</li>
          <li>密码修改</li>
          <li>系统状态监控</li>
        </ul>
      </Card>
    </div>
  );
}

export default Dashboard;
