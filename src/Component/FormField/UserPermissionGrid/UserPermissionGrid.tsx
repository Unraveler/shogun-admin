import React, {
  useEffect,
  useState,
  useRef
} from 'react';

import {
  useTranslation
} from 'react-i18next';

import {
  Button,
  Input,
  InputRef,
  message,
  Space,
  Table,
  Tooltip
} from 'antd';

import type {
  ColumnsType,
  TableProps,
  ColumnType
} from 'antd/es/table';

import {
  DeleteOutlined,
  SearchOutlined
} from '@ant-design/icons';

import Logger from 'js-logger';

import _cloneDeep from 'lodash/cloneDeep';

import PermissionCollectionType from '@terrestris/shogun-util/dist/model/enum/PermissionCollectionType';
import UserInstancePermission from '@terrestris/shogun-util/dist/model/security/UserInstancePermission';

import UserPermissionModal from './UserPermissionModal/UserPermissionModal';

import useSHOGunAPIClient from '../../../Hooks/useSHOGunAPIClient';
import UserAvatar from './UserAvatar/UserAvatar';
import User from '@terrestris/shogun-util/dist/model/User';
import PermissionSelect from './PermissionSelect/PermissionSelect';

import './UserPermissionGrid.less';

interface DataType {
  key: number;
  user: User;
  name: string;
  permission: PermissionCollectionType;
}

export interface UserPermissionGridProps extends TableProps<DataType> {
  entityType: string;
  entityId: number;
};

const UserPermissionGrid: React.FC<UserPermissionGridProps> = ({
  entityType,
  entityId,
  ...passThroughProps
}) => {
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [permissions, setPermissions] = useState<UserInstancePermission[]>([]);
  const [data, setData] = useState<DataType[]>([]);

  const searchInput = useRef<InputRef>(null);

  const { t } = useTranslation();
  const client = useSHOGunAPIClient();

  useEffect(() => {
    (async () => {
      setPermissionsLoading(true);

      if (Number.isFinite(entityId)) {
        try {
          setPermissions(await client[entityType]().getUserInstancePermissions(entityId));
        } catch (error) {
          message.error(t('UserPermissionGrid.loadErrorMsg'));
          Logger.error(error);
        } finally {
          setPermissionsLoading(false);
        }
      }
    })();
  }, [entityId, entityType, client, t]);

  useEffect(() => {
    if (client && Array.isArray(permissions)) {
      const userData = permissions.map(permission => ({
        key: permission.user?.id,
        user: permission.user,
        name: `${permission.user?.providerDetails?.username} (${permission.user?.authProviderId})`,
        permission: permission.permission?.name
      }));

      setData(userData);
    }
  }, [client, permissions]);

  const getColumnSearchProps = (dataIndex: string): ColumnType<DataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        className="column-search"
      >
        <Input
          ref={searchInput}
          placeholder={t('UserPermissionGrid.filterInputPlaceholder')}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
          >
            {t('UserPermissionGrid.filterSearchButtonText')}
          </Button>
          <Button
            onClick={() => {
              clearFilters();
              confirm();
            }}
            size="small"
          >
            {t('UserPermissionGrid.filterResetButtonText')}
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    }
  });

  const onPermissionSelect = async (permission: PermissionCollectionType, record: DataType) => {
    setPermissionsLoading(true);

    try {
      await client[entityType]().setUserInstancePermission(entityId, record.user?.id, permission);

      let dataClone = _cloneDeep(data);
      let match = dataClone.find(entry => entry.user?.id === record.user?.id);
      match.permission = permission;

      setData(dataClone);
    } catch (error) {
      message.error(t('UserPermissionGrid.updateErrorMsg'));
      Logger.error(error);
    } finally {
      setPermissionsLoading(false);
    }
  };

  const onDeleteClick = async (record: DataType) => {
    setPermissionsLoading(true);

    try {
      await client[entityType]().deleteUserInstancePermission(entityId, record.user?.id);

      let dataClone = data.filter(entry => entry.user?.id !== record.user?.id);

      setData(dataClone);
    } catch (error) {
      message.error(t('UserPermissionGrid.deleteErrorMsg'));
      Logger.error(error);
    } finally {
      setPermissionsLoading(false);
    }
  };

  const onSave = async () => {
    setPermissionsLoading(true);

    try {
      setPermissions(await client[entityType]().getUserInstancePermissions(entityId));
    } catch (error) {
      message.error(t('UserPermissionGrid.loadErrorMsg'));
      Logger.error(error);
    } finally {
      setPermissionsLoading(false);
    }
  };

  const columns: ColumnsType<DataType> = [{
    title: t('UserPermissionGrid.userColumnTitle'),
    dataIndex: 'name',
    key: 'name',
    defaultSortOrder: 'ascend',
    sorter: (a, b) => a.user?.providerDetails?.username?.localeCompare(b.user?.providerDetails?.username),
    render: (value: any, record: DataType) => (
      <UserAvatar
        user={record.user}
      />
    ),
    ...getColumnSearchProps('name')
  }, {
    title: t('UserPermissionGrid.permissionColumnTitle'),
    dataIndex: 'permission',
    key: 'permission',
    sorter: (a, b) => b.name?.localeCompare(a.name),
    render: (value: any, record: DataType) => (
      <PermissionSelect
        value={record.permission}
        onSelect={(val: PermissionCollectionType) => {
          onPermissionSelect(val, record);
        }}
      />
    )
  }, {
    title: (
      <UserPermissionModal
        entityType={entityType}
        entityId={entityId}
        onSave={onSave}
      />
    ),
    key: 'operation',
    className: 'operation-column',
    width: 100,
    fixed: 'right',
    render: (value: any, record: DataType) => {
      return (
        <Tooltip
          title={t('UserPermissionGrid.deletePermissionButtonTooltip')}
        >
          <DeleteOutlined
            onClick={() => onDeleteClick(record)}
          />
        </Tooltip>
      );
    },
  }];

  return (
    <Table
      className='permission-grid'
      loading={permissionsLoading}
      columns={columns}
      dataSource={data}
      {
        ...passThroughProps
      }
    />
  );
};

export default UserPermissionGrid;
