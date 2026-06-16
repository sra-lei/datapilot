/**
 * 系统设置页面
 */

import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  Switch,
  Button,
  message,
  Space,
  Divider,
  Descriptions,
  Badge,
  Spin,
} from 'antd';
import {
  SettingOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { checkBusinessHealth } from '../services/business';

interface ServiceStatus {
  status: 'ok' | 'error' | 'checking';
  service: string;
  lastCheck: Date | null;
}

function SystemSettings() {
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>({
    status: 'checking',
    service: 'charter_mate',
    lastCheck: null,
  });
  const [form] = Form.useForm();

  // 检查业务服务状态
  const checkServiceStatus = async () => {
    setServiceStatus(prev => ({ ...prev, status: 'checking' }));

    try {
      const result = await checkBusinessHealth();
      if (result.status === 200 && result.data) {
        setServiceStatus({
          status: result.data.status === 'ok' ? 'ok' : 'error',
          service: result.data.service || 'charter_mate',
          lastCheck: new Date(),
        });
      } else {
        setServiceStatus({
          status: 'error',
          service: 'charter_mate',
          lastCheck: new Date(),
        });
      }
    } catch (error) {
      console.error('检查服务状态失败', error);
      setServiceStatus({
        status: 'error',
        service: 'charter_mate',
        lastCheck: new Date(),
      });
    }
  };

  useEffect(() => {
    checkServiceStatus();
  }, []);

  const handleSave = () => {
    form.validateFields().then((values) => {
      console.log('保存设置:', values);
      message.success('设置已保存');
    });
  };

  return (
    <div>
      <Card title={<><SettingOutlined /> 系统设置</>}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            logLevel: 'info',
            theme: 'light',
          }}
        >
          <Card type="inner" title="系统配置" style={{ marginBottom: 16 }}>
            <Form.Item
              name="logLevel"
              label="日志级别"
            >
              <Select>
                <Select.Option value="debug">Debug</Select.Option>
                <Select.Option value="info">Info</Select.Option>
                <Select.Option value="warn">Warn</Select.Option>
                <Select.Option value="error">Error</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="theme"
              label="界面主题"
            >
              <Select>
                <Select.Option value="light">浅色主题</Select.Option>
                <Select.Option value="dark">深色主题</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="enableCache"
              label="启用缓存"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>

          <Space>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
            >
              保存设置
            </Button>
          </Space>
        </Form>
      </Card>

      <Divider />

      <Card
        title={<><CheckCircleOutlined /> 服务状态</>}
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={checkServiceStatus}
            loading={serviceStatus.status === 'checking'}
          >
            刷新状态
          </Button>
        }
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="服务名称">
            <Badge
              status={serviceStatus.status === 'ok' ? 'success' : 'error'}
              text={serviceStatus.service}
            />
          </Descriptions.Item>
          <Descriptions.Item label="服务状态">
            {serviceStatus.status === 'checking' ? (
              <Spin size="small" />
            ) : serviceStatus.status === 'ok' ? (
              <Badge status="success" text="运行正常" />
            ) : (
              <Badge status="error" text="服务异常" />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="接口地址">
            http://localhost:8000/api/v1/health
          </Descriptions.Item>
          <Descriptions.Item label="最后检查时间">
            {serviceStatus.lastCheck
              ? serviceStatus.lastCheck.toLocaleString('zh-CN')
              : '未检查'}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}

export default SystemSettings;
