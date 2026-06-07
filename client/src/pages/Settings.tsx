/**
 * 系统设置页面
 */

import { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  message,
  Space,
  Divider,
  Descriptions,
} from 'antd';
import {
  SettingOutlined,
  DatabaseOutlined,
  SaveOutlined,
} from '@ant-design/icons';

interface DatabaseStats {
  tableCount: number;
  totalRows: number;
  dbFileSize: number;
  dbFilePath: string;
}

function SystemSettings() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [form] = Form.useForm();

  // 加载系统信息
  const loadStats = async () => {
    try {
      const response = await fetch('/api/database/stats');
      const result = await response.json();

      if (result.code === 200) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('加载统计信息失败', error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

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
            dbType: 'sqlite',
            logLevel: 'info',
            theme: 'light',
          }}
        >
          <Card type="inner" title="数据库配置" style={{ marginBottom: 16 }}>
            <Form.Item
              name="dbType"
              label="数据库类型"
            >
              <Select>
                <Select.Option value="sqlite">SQLite (开发环境)</Select.Option>
                <Select.Option value="mysql">MySQL (生产环境)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="dbPath"
              label="数据库路径"
            >
              <Input placeholder="数据库文件路径" disabled value={stats?.dbFilePath} />
            </Form.Item>
          </Card>

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

      <Card title={<><DatabaseOutlined /> 系统信息</>}>
        {stats && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="数据库类型">SQLite</Descriptions.Item>
            <Descriptions.Item label="数据库路径">{stats.dbFilePath}</Descriptions.Item>
            <Descriptions.Item label="表数量">{stats.tableCount}</Descriptions.Item>
            <Descriptions.Item label="总记录数">{stats.totalRows}</Descriptions.Item>
            <Descriptions.Item label="数据库大小">{formatFileSize(stats.dbFileSize)}</Descriptions.Item>
            <Descriptions.Item label="运行环境">开发环境</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </div>
  );
}

export default SystemSettings;
