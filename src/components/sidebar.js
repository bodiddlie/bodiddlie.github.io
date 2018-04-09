import React from 'react';
import styled from 'styled-components';
import FaGithub from 'react-icons/lib/fa/github';
import FaTwitter from 'react-icons/lib/fa/twitter';
import Link from 'gatsby-link';

export default () => (
  <Container>
    <HeadingLink to="/">
      <Heading>Nick Klepinger</Heading>
    </HeadingLink>
    <Lead>Programming, Gamedev, Gaming, and other nerdy nonsense.</Lead>
    <div>
      <Icon href="https://github.com/bodiddlie">
        <FaGithub size={40} />
      </Icon>
      <Icon href="https://twitter.com/bodiddlie">
        <FaTwitter size={40} />
      </Icon>
    </div>
    <CopyLine>&copy; {new Date().getFullYear()}. All rights reserved.</CopyLine>
  </Container>
);

const Container = styled.div`
  background: #202020;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  flex: 1 25%;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 0.25rem 1rem;
  }
`;

const Heading = styled.h1`
  color: white;
  margin: 0;
`;

const Lead = styled.p`
  font-size: 1.25rem;
  font-weight: 300;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Icon = styled.a`
  text-decoration: none;
  color: inherit;
`;

const HeadingLink = styled(Link) `
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CopyLine = styled.p`
  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`