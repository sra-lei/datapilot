/**
 * 系统设置页面
 */

import { Card, Form, Select, Switch, Button, message, Space } from 'antd';
import { SettingOutlined, SaveOutlined } from '@ant-design/icons';

function SystemSettings() {
  const [form] = Form.useForm();

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
            <Form.Item name="logLevel" label="日志级别">
              <Select>
                <Select.Option value="debug">Debug</Select.Option>
                <Select.Option value="info">Info</Select.Option>
                <Select.Option value="warn">Warn</Select.Option>
                <Select.Option value="error">Error</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="theme" label="界面主题">
              <Select>
                <Select.Option value="light">浅色主题</Select.Option>
                <Select.Option value="dark">深色主题</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="enableCache" label="启用缓存" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Card>

          <Space>
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
              保存设置
            </Button>
          </Space>
        </Form>
      </Card>

      <Card title="提示" style={{ marginTop: 16 }}>
        <p>服务状态监控已移至仪表盘页面，请在仪表盘中查看 Core Service 和 CharterMate 的运行状态。</p>
      </Card>
    </div>
  );
}

export default SystemSettings;