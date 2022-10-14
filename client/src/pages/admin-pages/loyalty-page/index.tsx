import { UnstyledExternalLink, Button } from 'components-library';

export const LoyaltyPage = () => {
  return (
    <div>
      <h1>Stay tuned</h1>
      <p>Feature coming soon...</p>
      <UnstyledExternalLink
        href="https://www.producthunt.com/upcoming/chairleader"
        target="_blank"
      >
        <Button icon="launch" secondary>
          Get early access
        </Button>
      </UnstyledExternalLink>
    </div>
  );
};
