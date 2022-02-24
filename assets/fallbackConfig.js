var shogunApplicationConfig = {
  appPrefix: '',
  path: {
    base: 'http://localhost:8080',
    swagger: '/v2/api-docs',
    user: '/users',
    layer: '/layers',
    imageFile: '/imagefiles',
    application: '/applications',
    appInfo: '/info/app',
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      isSessionValid: '/auth/isSessionValid'
    },
    keycloak: {
      base: 'http://localhost:8000/auth',
      realm: 'SpringBootKeycloak',
      clientId: 'shogun-app'
    },
    loggers: '/actuator/loggers',
    logfile: '/actuator/logfile',
    logo: null,
    metrics: '/actuator/metrics',
    evictCache: '/cache/evict'
  },
  dashboard: {
    news: {
      visible: true
    },
    statistics: {
      visible: true
    },
    applications: {
      visible: true
    },
    layers: {
      visible: true
    },
    users: {
      visible: true
    }
  },
  navigation: {
    general: {
      applications: {
        visible: true,
        schemas: {
          clientConfig: 'DefaultApplicationClientConfig',
          layerTree: 'DefaultLayerTree',
          layerConfig: 'DefaultLayerConfig'
        }
      },
      layers: {
        visible: true,
        schemas: {
          clientConfig: 'DefaultLayerClientConfig',
          sourceConfig: 'DefaultLayerSourceConfig',
          features: 'GeoJsonObject'
        }
      },
      users: {
        visible: true
      },
      imagefiles: {
        visible: true
      }
    },
    status: {
      metrics: {
        visible: true
      },
      logs: {
        visible: true
      }
    },
    settings: {
      global: {
        visible: true
      },
      logs: {
        visible: true
      }
    }
  }
};
