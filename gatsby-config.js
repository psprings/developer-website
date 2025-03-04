const quote = (str) => `"${str}"`;

module.exports = {
  flags: {
    DEV_SSR: true,
    PRESERVE_WEBPACK_CACHE: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
  },
  siteMetadata: {
    title: 'New Relic Developers',
    titleTemplate: '%s | New Relic Developers',
    description:
      'Do more on our platform and make New Relic your own with APIs, SDKs, code snippets, tutorials, and more developer tools.',
    author: 'New Relic',
    repository: 'https://github.com/newrelic/developer-website',
    siteUrl: 'https://developer.newrelic.com',
    branch: 'develop',
  },
  plugins: [
    'gatsby-plugin-sharp',
    {
      resolve: '@newrelic/gatsby-theme-newrelic',
      options: {
        forceTrailingSlashes: true,
        layout: {
          contentPadding: '2rem',
          maxWidth: '1700px',
          component: require.resolve('./src/layouts'),
          mobileBreakpoint: '760px',
        },
        prism: {
          languages: ['yaml', 'sass', 'scss', 'java'],
        },
        splitio: {
          core: {
            authorizationKey: process.env.SPLITIO_AUTH_KEY || 'localhost',
          },
          features: {
            free_account_button_color: {
              treatment: 'off',
            },
          },
          env: {
            development: {
              features: {
                'developer-website_global-header-gh-buttons': 'on',
                'developer-website_right-rail-buttons': 'outline',
              },
              core: {
                authorizationKey: process.env.SPLITIO_AUTH_KEY || 'localhost',
              },
            },
          },
        },
        relatedResources: {
          swiftype: {
            resultsPath: `${__dirname}/src/data/related-pages.json`,
            refetch: Boolean(process.env.BUILD_RELATED_CONTENT),
            engineKey: 'Ad9HfGjDw4GRkcmJjUut',
            limit: 5,
            getSlug: ({ node }) => node.frontmatter.path,
            getParams: ({ node }) => {
              const { tags, title } = node.frontmatter;

              return {
                q: tags ? tags.map(quote).join(' OR ') : title,
                search_fields: {
                  page: ['tags^10', 'body^5', 'title^1.5', '*'],
                },
                filters: {
                  page: {
                    type: ['docs', 'developer', 'opensource'],
                    document_type: [
                      '!views_page_menu',
                      '!term_page_api_menu',
                      '!term_page_landing_page',
                    ],
                  },
                },
              };
            },
            filter: ({ node }) => node.frontmatter.template === 'GuideTemplate',
          },
        },
        newrelic: {
          configs: {
            production: {
              instrumentationType: 'proAndSPA',
              accountId: '10956800',
              trustKey: '1',
              agentID: '30712246',
              licenseKey: 'NRJS-649173eb1a7b28cd6ab',
              applicationID: '30712246',
              beacon: 'staging-bam-cell.nr-data.net',
              errorBeacon: 'staging-bam-cell.nr-data.net',
            },
            staging: {
              instrumentationType: 'proAndSPA',
              accountId: '10956800',
              trustKey: '1',
              agentID: '30712246',
              licenseKey: 'NRJS-649173eb1a7b28cd6ab',
              applicationID: '30712246',
              beacon: 'staging-bam-cell.nr-data.net',
              errorBeacon: 'staging-bam-cell.nr-data.net',
            },
          },
        },
        tessen: {
          product: 'DEV',
          subproduct: 'TDEV',
          segmentWriteKey: 'Ako0hclX8WGHwl9rm4n5uxLtT4wgEtuU',
          trackPageViews: true,
          pageView: {
            name: 'pageView',
            category: 'DocPageView',
            getProperties: ({ location, env }) => ({
              path: location.pathname,
              env: env === 'production' ? 'prod' : env,
            }),
          },
        },
      },
    },
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/favicon.png',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'markdown-pages',
        path: `${__dirname}/src/markdown-pages`,
      },
    },
    'gatsby-remark-images',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxHeight: 400,
              maxWidth: 1200,
              fit: 'inside',
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: `gatsby-remark-autolink-headers`,
            options: {
              icon:
                '<svg xmlns="http://www.w3.org/2000/svg" focusable="false" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-newrelic-sdk',
      options: {
        release: 'release-2776',
      },
    },
    'gatsby-plugin-embed-pages',
    'gatsby-plugin-meta-redirect',
    {
      resolve: 'gatsby-plugin-gdpr-tracking',
      options: {
        debug: false,
        googleAnalytics: {
          trackingId: 'UA-3047412-33',
          autoStart: false,
          anonymize: true,
          controlCookieName: 'newrelic-gdpr-consent',
        },
        environments: ['production', 'development'],
      },
    },
  ],
};
