import React from 'react';
import styled from 'styled-components';
import ReactDisqusComments from 'react-disqus-comments';

const Container = styled.div`
  max-width: 1000px;
`;

const Heading = styled.div`
  border-bottom: 1px solid #eee;
`;

const H1 = styled.h1`
  font-weight: 400;
  margin: 0;
`;

const DateLine = styled.span`
  color: #828282;
`;
export default ({ data }) => {
  const post = data.markdownRemark;
  const { url } = data.site.siteMetadata;
  const identifier = post.fields.slug.substring(1, post.fields.slug.length - 1);
  console.log(identifier);
  return (
    <Container>
      <Heading>
        <H1>{post.frontmatter.title}</H1>
        <DateLine>{post.frontmatter.date}</DateLine>
      </Heading>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <ReactDisqusComments
        shortname="regnipelk"
        url={`${url}${post.fields.slug}`}
        title={post.frontmatter.title}
        identifier={post.fields.slug}
      />
    </Container>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    site {
      siteMetadata {
        url
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        date(formatString: "MMM DD, YYYY")
      }
      fields {
        slug
      }
    }
  }
`;
