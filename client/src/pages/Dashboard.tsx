/**
 * 仪表盘页面
 */

import { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Button, message, Badge, Spin } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  LogoutOutlined,
  CloudServerOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { checkHealth, changePassword } from '../services/user';
import { checkBusinessHealth } from '../services/business';
import type { ApiResponse } from '../services/types';

interface ServiceStatus {
  status: 'ok' | 'error' | 'checking';
  lastCheck: Date | null;
}

function Dashboard() {
  const [coreStatus, setCoreStatus] = useState<ServiceStatus>({
    status: 'checking',
    lastCheck: null,
  });
  const [chartermateStatus, setChartermateStatus] = useState<ServiceStatus>({
    status: 'checking',
    lastCheck: null,
  });
  const [user, setUser] = useState<{ username: string } | null>(null);

  // 检查 Core Service 状态
  const checkCoreHealthStatus = async () => {
    setCoreStatus(prev => ({ ...prev, status: 'checking' }));
    try {
      const data = await checkHealth();
      setCoreStatus({
        status: data.data?.status === 'ok' ? 'ok' : 'error',
        lastCheck: new Date(),
      });
    } catch {
      setCoreStatus({
        status: 'error',
        lastCheck: new Date(),
      });
    }
  };

  // 检查 CharterMate Service 状态
  const checkChartermateHealthStatus = async () => {
    setChartermateStatus(prev => ({ ...prev, status: 'checking' }));
    try {
      const result = await checkBusinessHealth();
      if (result.status === 200 && result.data) {
        setChartermateStatus({
          status: result.data.status === 'ok' ? 'ok' : 'error',
          lastCheck: new Date(),
        });
      } else {
        setChartermateStatus({
          status: 'error',
          lastCheck: new Date(),
        });
      }
    } catch {
      setChartermateStatus({
        status: 'error',
        lastCheck: new Date(),
      });
    }
  };

  // 刷新所有服务状态
  const refreshAllStatus = () => {
    checkCoreHealthStatus();
    checkChartermateHealthStatus();
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 初始化检查所有服务状态
    refreshAllStatus();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
    message.success('已退出登录');
  };

  const handleChangePassword = async () => {
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

      if (result.status === 200) {
        message.success(result.msg);
      } else {
        message.error(result.msg);
      }
    } catch (error) {
      message.error('修改失败，请重试');
    }
  };

  // 渲染服务状态
  const renderStatus = (status: ServiceStatus) => {
    if (status.status === 'checking') {
      return <Spin size="small" />;
    }
    return (
      <Badge
        status={status.status === 'ok' ? 'success' : 'error'}
        text={status.status === 'ok' ? '运行正常' : '服务异常'}
      />
    );
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card
            hoverable
            onClick={checkCoreHealthStatus}
          >
            <Statistic
              title="Core Service"
              valueRender={() => renderStatus(coreStatus)}
              prefix={<CloudServerOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
              {coreStatus.lastCheck
                ? `最后检查: ${coreStatus.lastCheck.toLocaleTimeString('zh-CN')}`
                : '未检查'}
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card
            hoverable
            onClick={checkChartermateHealthStatus}
          >
            <Statistic
              title="CharterMate"
              valueRender={() => renderStatus(chartermateStatus)}
              prefix={<CloudServerOutlined />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
              {chartermateStatus.lastCheck
                ? `最后检查: ${chartermateStatus.lastCheck.toLocaleTimeString('zh-CN')}`
                : '未检查'}
            </div>
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
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card
            title="快捷操作"
            extra={
              <Button
                icon={<ReloadOutlined />}
                onClick={refreshAllStatus}
                size="small"
              >
                刷新状态
              </Button>
            }
          >
            <Button.Group>
              <Button onClick={handleChangePassword} type="primary">
                修改密码
              </Button>
              <Button onClick={handleLogout} danger>
                <LogoutOutlined /> 退出登录
              </Button>
            </Button.Group>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="服务地址">
            <ul style={{ paddingLeft: 20, margin: 0 }}>
              <li>Core Service: http://localhost:3002</li>
              <li>CharterMate: http://localhost:8000</li>
              <li>API 文档: http://localhost:3002/core/api-docs</li>
            </ul>
          </Card>
        </Col>
      </Row>

      <Card title="欢迎使用 Trae 管理系统" style={{ marginTop: 24 }}>
        <p>这是一个基于 Ant Design Pro 的管理后台系统。</p>
        <p>当前已实现功能：</p>
        <ul>
          <li>用户登录/注册</li>
          <li>密码修改</li>
          <li>系统状态监控（Core Service 和 CharterMate）</li>
        </ul>
      </Card>
    </div>
  );
}

export default Dashboard;
