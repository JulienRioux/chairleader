import { UnstyledButton } from 'components-library/button';
import { Icon } from 'components-library/icon';
import { ReactNode, useState } from 'react';
import styled from 'styled-components';

const CollapsibleWrapper = styled.div`
  border: 1px solid ${(p) => p.theme.color.text}22;
  border-radius: ${(p) => p.theme.borderRadius.default};
`;

const ToggleBtn = styled(UnstyledButton)<{ isCollapse: boolean }>`
  padding: 8px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 20px;
  font-weight: bold;

  ${(p) => !p.isCollapse && `border-bottom: 1px solid ${p.theme.color.text}22;`}
`;

const ChildrenWrapper = styled.div`
  padding: 8px;
`;

export const Collapsible = ({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) => {
  const [isCollapse, setIsCollapse] = useState(true);
  return (
    <CollapsibleWrapper>
      <ToggleBtn
        onClick={() => setIsCollapse(!isCollapse)}
        isCollapse={isCollapse}
      >
        <span>{title}</span>
        <span>
          <Icon name={isCollapse ? 'arrow_downward' : 'arrow_upward'} />
        </span>
      </ToggleBtn>

      {!isCollapse && <ChildrenWrapper>{children}</ChildrenWrapper>}
    </CollapsibleWrapper>
  );
};
