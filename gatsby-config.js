module.exports = {
  siteMetadata: {
    title: "Nick Klepinger's Blog",
    url: 'https://bodiddlie.github.io',
  },
  plugins: [
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 768,
            },
          },
        ],
      },
    },
    `gatsby-plugin-styled-components`,
  ],
};
