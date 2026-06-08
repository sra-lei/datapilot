/**
 * 用户管理页面
 */

import { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Tag,
  Select,
} from 'antd';
import {
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { usePermission } from '../contexts/PermissionContext';
import { getAllRoles, Role } from '../services/permission';
import { register } from '../services/user';

interface User {
  id: number;
  username: string;
  email: string | null;
  created_at: string;
}

function UserManagement() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [form] = Form.useForm();
  const { can } = usePermission();

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database/tables/users/data');
      const result = await response.json();

      if (result.code === 200) {
        setUsers(result.data?.rows || []);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('加载用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 加载角色列表
  const loadRoles = async () => {
    try {
      const response = await getAllRoles();
      if (response.code === 200) {
        setRoles(response.data || []);
      }
    } catch (error) {
      console.error('加载角色列表失败', error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  // 获取可选角色（管理员可以选择developer和user，其他角色不能添加用户）
  const getAvailableRoles = () => {
    // 管理员可以添加开发人员和普通用户
    if (can('create', 'User')) {
      return roles.filter((r) => r.name !== 'admin');
    }
    return [];
  };

  const handleAddUser = async (values: { username: string; password: string; email?: string; roleId: number }) => {
    try {
      const response = await register({
        username: values.username,
        password: values.password,
        email: values.email,
        roleId: values.roleId,
      });

      if (response.code === 200) {
        message.success('用户添加成功');
        setModalVisible(false);
        form.resetFields();
        loadUsers();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('添加用户失败');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (text: string | null) => text || <Tag color="default">未设置</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => message.info('功能开发中')}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => message.info('功能开发中')}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  const availableRoles = getAvailableRoles();

  return (
    <div>
      <Card
        title={<><UserOutlined /> 用户管理</>}
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadUsers}
            >
              刷新
            </Button>
            {/* 只有管理员可以添加用户 */}
            {can('create', 'User') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setModalVisible(true)}
              >
                添加用户
              </Button>
            )}
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="添加用户"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => {
          form.validateFields().then((values) => {
            handleAddUser(values);
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select placeholder="请选择角色">
              {availableRoles.map((role) => (
                <Select.Option key={role.id} value={role.id}>
                  {role.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;
