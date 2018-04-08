import React from 'react';
import styled from 'styled-components';
import Link from 'gatsby-link';

const Container = styled.div`
  max-width: 1000px;
`;

const Heading = styled.h1`
  font-weight: 400;
`;

const StyledLink = styled(Link)`
  color: #2a7ae2;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const DateLine = styled.span`
  color: #828282;
  font-size: 0.9rem;
`;

const H2 = styled.h2`
  font-weight: 400;
  margin: 0;
  margin-bottom: 0.9rem;
`;

export default ({ data }) => {
  return (
    <Container>
      <Heading>{data.site.siteMetadata.title}</Heading>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <DateLine>{node.frontmatter.date}</DateLine>
          <H2>
            <StyledLink to={node.fields.slug}>
              {node.frontmatter.title}
            </StyledLink>
          </H2>
          <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
        </div>
      ))}
    </Container>
  );
};

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          id
          html
          frontmatter {
            title
            date(formatString: "MMM DD, YYYY")
          }
          excerpt(pruneLength: 480)
          fields {
            slug
          }
        }
      }
    }
  }
`;
