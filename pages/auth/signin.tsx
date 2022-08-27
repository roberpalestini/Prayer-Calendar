import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Hero,
  Container,
  Columns,
  Box,
  Heading,
  Button,
} from 'react-bulma-components';

export default function SignIn({ providers }) {
  const router = useRouter();
  const { error } = router.query;

  return (
    <Hero size="fullheight">
      <Hero.Body>
        <Container>
          <Columns centered="true">
            <Columns.Column
              tablet={{ size: '5' }}
              desktop={{ size: '4' }}
              widescreen={{ size: '3' }}
            >
              <Box>
                <Heading size="3" className="has-text-centered">
                  Prayer Calendar
                </Heading>
                {error && (
                  <p className="has-text-danger has-text-centered">{error}</p>
                )}
                {Object.values(providers).map((provider) => (
                  <div
                    key={provider.name}
                    className="is-flex is-justify-content-center"
                  >
                    <Button
                      onClick={() =>
                        signIn(provider.id, {
                          redirect: true,
                          callbackUrl: router.query.callbackUrl,
                        })
                      }
                    >
                      Sign in with {provider.name}
                    </Button>
                  </div>
                ))}
              </Box>
            </Columns.Column>
          </Columns>
        </Container>
      </Hero.Body>
    </Hero>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
