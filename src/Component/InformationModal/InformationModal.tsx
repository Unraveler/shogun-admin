import React from 'react';
import { Divider, Modal, Table, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import Title from 'antd/lib/typography/Title';
import { ColumnsType } from 'antd/lib/table';
import {
  GroupedInformationModalTableDataType,
  InformationModalTableDataType
} from './types';
import {
  LayerConfigurationDocTableData,
  exampleConfig as AppLayerConfigExample,
  description as AppLayerConfigDescription
} from './information/application/LayerConfigInformation';
import {
  ClientConfigDocTableData as AppClientConfigDocTableData,
  exampleConfig as AppClientConfigExample,
  description as AppClientConfigDescription
} from './information/application/ClientConfigInformation';
import {
  LayerTreeDocTableData,
  exampleConfig as AppLayerTreeExample,
  description as AppLayerTreeDescription
} from './information/application/LayerTreeInformation';
import { 
  ToolConfigDocTableData,
  exampleConfig as AppToolConfigExample,
  description as AppToolConfigDescription
} from './information/application/ToolConfigInformation';
import {
  ClientConfigDocTableData as LayerClientConfigDocTableData ,
  exampleConfig as LayerClientConfigExample,
  description as LayerClientConfigDescription
} from './information/layer/ClientConfigInformation';
import {
  SourceConfigurationDocTableData,
  exampleConfig as LayerSourceConfigExample,
  description as LayerSourceConfigDescription
} from './information/layer/SourceConfigInformation';
import {
  FeaturesDocTableData,
  exampleConfig as LayerFeaturesExample,
  description as LayerFeaturesDescription
} from './information/layer/FeaturesInformation';
import {
  ProviderDetailsDocTableData,
  exampleConfig as UserProviderDetailsExample,
  description as UserProviderDetailsDescription
} from './information/user/ProviderDetailsInformation';
import {
  DetailsDocTableData,
  exampleConfig as UserDetailsExample,
  description as UserDetailsDescription
} from './information/user/DetailsInformation';
import {
  ClientConfigDocTableData as UserClientConfigDocTableData,
  exampleConfig as UserClientConfigExample,
  description as UserClientConfigDescription
} from './information/user/ClientConfigInformation';

interface InformationModalProps {
  dataField?: string;
  entity?: string;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

export const InformationModal: React.FC<InformationModalProps> = ({
  dataField = '',
  entity = '',
  isModalOpen = false,
  setIsModalOpen
}) => {
  const tmpFlat = [];

  const docTableColums: ColumnsType  = [
    {
      title: 'Property Name',
      dataIndex: 'propertyName',
      key: 'propertyName',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Example',
      dataIndex: 'example',
      key: 'example',
    },
    {
      title: 'Data type',
      dataIndex: 'dataType',
      key: 'dataType',
    },
    {
      title: 'Required',
      dataIndex: 'required',
      key: 'required',
    },
  ];

  const getDescription = () => {
    switch (`${entity}-${dataField}`) {
      case 'application-clientConfig':
        return AppClientConfigDescription;
      case 'application-layerTree':
        return AppLayerTreeDescription;
      case 'application-layerConfig':
        return AppLayerConfigDescription;
      case 'application-toolConfig':
        return AppToolConfigDescription;

      case 'layer-clientConfig':
        return LayerClientConfigDescription;
      case 'layer-sourceConfig':
        return LayerSourceConfigDescription;
      case 'layer-features':
        return LayerFeaturesDescription;

      case 'user-providerDetails':
        return UserProviderDetailsDescription;
      case 'user-details':
        return UserDetailsDescription;
      case 'user-clientConfig':
        return UserClientConfigDescription;

      default:
        return 'TODO';
    }
  };

  const getTableData = () => {
    switch (`${entity}-${dataField}`) {
      case 'application-clientConfig':
        return AppClientConfigDocTableData;
      case 'application-layerTree':
        return LayerTreeDocTableData;
      case 'application-layerConfig':
        return LayerConfigurationDocTableData;
      case 'application-toolConfig':
        return ToolConfigDocTableData;

      case 'layer-clientConfig':
        return LayerClientConfigDocTableData;
      case 'layer-sourceConfig':
        return SourceConfigurationDocTableData;
      case 'layer-features':
        return FeaturesDocTableData;

      case 'user-providerDetails':
        return ProviderDetailsDocTableData;
      case 'user-details':
        return DetailsDocTableData;
      case 'user-clientConfig':
        return UserClientConfigDocTableData;

      default:
        return [{
          propertyName: 'propertyName',
          description: 'description',
          example: 'example',
          dataType: 'dataType',
          required: 'required',
        }];
    }
  };

  const getExample = (): string => {
    switch (`${entity}-${dataField}`) {
      case 'application-clientConfig':
        return AppClientConfigExample;
      case 'application-layerTree':
        return AppLayerTreeExample;
      case 'application-layerConfig':
        return AppLayerConfigExample;
      case 'application-toolConfig':
        return AppToolConfigExample;

      case 'layer-clientConfig':
        return LayerClientConfigExample;
      case 'layer-sourceConfig':
        return LayerSourceConfigExample;
      case 'layer-features':
        return LayerFeaturesExample;

      case 'user-providerDetails':
        return UserProviderDetailsExample;
      case 'user-details':
        return UserDetailsExample;
      case 'user-clientConfig':
        return UserClientConfigExample;

      default:
        return `{
          Example: 'example'
        }`;
    }
  };

  const {
    t
  } = useTranslation();

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  /**
   * @description This method grabs the struture
   * @param data The array containing the json with the structure to present the data
   * @param parentName The name of the parent node
   * @returns
   */
  const groupDocumentationData = (
    data: InformationModalTableDataType[],
    parentName: string
  ): GroupedInformationModalTableDataType => {
    const flatDocData = docParser(data, parentName);
    const groupedData = flatDocData.reduce((acc, obj) => {
      const key = obj['parent'];
      if (!acc[key]) {
        acc[key] = [];
      }
      // Add object to list for given key's value
      acc[key].push(obj);
      return acc;
    }, {});
    return groupedData;
  };

  /**
   * An helper function
   * @param data
   * @param parentName
   * @returns
   */
  const docParser = (
    data: InformationModalTableDataType[],
    parentName: string
  ): InformationModalTableDataType[] => {
    data.forEach((d: InformationModalTableDataType) => {
      if (d.subProps) {
        tmpFlat.push({
          ...d,
          parent: parentName
        });
        return docParser(d.subProps, d.propertyName);
      }
      tmpFlat.push({
        ...d,
        parent: parentName
      });
      return '';
    });

    return tmpFlat;
  };

  const documentTableData = groupDocumentationData(getTableData(), dataField);

  return (
    <Modal
      width='95vw'
      visible={isModalOpen}
      title={(
        <Title level={2}>
          {`${entity} ${t('InformationModal.titlePredicate')}`}
        </Title>
      )}
      onCancel={handleCancel}
      mask={false}
      destroyOnClose={true}
      cancelText={t('InformationModal.closeButtonText')}
      okButtonProps={{ hidden: true }}
    >
      <Typography>
        <Typography.Paragraph>
          {getDescription()}
        </Typography.Paragraph>
      </Typography>
      <Divider />
      {Object.keys(documentTableData).map(key => {
        return (
          <>
            <Title level={3}>{key}</Title>
            <Table
              columns={docTableColums}
              dataSource={documentTableData[key]}
              pagination={false}
            />
          </>
        );
      })}
      <Divider />
      <Title level={3}> Example </Title>
      <pre><code>
        {getExample()}
      </code></pre>
    </Modal>
  );
};

export default InformationModal;

