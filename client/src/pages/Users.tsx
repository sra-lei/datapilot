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
  Popconfirm,
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

interface EditModalData {
  visible: boolean;
  userId: number;
  username: string;
}

function UserManagement() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalData, setEditModalData] = useState<EditModalData>({
    visible: false,
    userId: 0,
    username: '',
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
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
    if (can('create', 'User')) {
      return roles.filter((r) => r.name !== 'admin');
    }
    return [];
  };

  // 添加用户
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
        setAddModalVisible(false);
        addForm.resetFields();
        loadUsers();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('添加用户失败');
    }
  };

  // 打开编辑弹窗
  const handleOpenEditModal = (user: User) => {
    setEditModalData({
      visible: true,
      userId: user.id,
      username: user.username,
    });
    editForm.resetFields();
  };

  // 编辑用户（修改密码）
  const handleEditUser = async (values: { newPassword: string }) => {
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: editModalData.username,
          oldPassword: 'temp', // 管理员修改不需要原密码
          newPassword: values.newPassword,
          force: true, // 强制修改标志
        }),
      });

      const result = await response.json();

      if (result.code === 200) {
        message.success('密码修改成功');
        setEditModalData({ visible: false, userId: 0, username: '' });
        editForm.resetFields();
        loadUsers();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('修改密码失败');
    }
  };

  // 删除用户
  const handleDeleteUser = async (userId: number, username: string) => {
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.code === 200) {
        message.success(`用户 ${username} 删除成功`);
        loadUsers();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      message.error('删除用户失败');
    }
  };

  // 判断用户是否为管理员
  const isAdmin = (username: string) => {
    return username === 'Sra' || username === 'admin';
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
          {isAdmin(text) && <Tag color="red">管理员</Tag>}
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
      render: (_: unknown, record: User) => {
        const isAdminUser = isAdmin(record.username);
        
        // 只有管理员可以编辑和删除用户
        if (!can('update', 'User')) {
          return null;
        }

        return (
          <Space>
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleOpenEditModal(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title={`确定删除用户 ${record.username}？`}
              disabled={isAdminUser}
              okText="确定"
              cancelText="取消"
              onConfirm={() => handleDeleteUser(record.id, record.username)}
            >
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                disabled={isAdminUser}
              >
                {isAdminUser ? '不可删除' : '删除'}
              </Button>
            </Popconfirm>
          </Space>
        );
      },
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
                onClick={() => setAddModalVisible(true)}
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

      {/* 添加用户弹窗 */}
      <Modal
        title="添加用户"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onOk={() => {
          addForm.validateFields().then((values) => {
            handleAddUser(values);
          });
        }}
      >
        <Form form={addForm} layout="vertical">
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

      {/* 编辑用户弹窗（修改密码） */}
      <Modal
        title={`修改用户 ${editModalData.username} 的密码`}
        open={editModalData.visible}
        onCancel={() => setEditModalData({ visible: false, userId: 0, username: '' })}
        onOk={() => {
          editForm.validateFields().then((values) => {
            handleEditUser(values);
          });
        }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;
