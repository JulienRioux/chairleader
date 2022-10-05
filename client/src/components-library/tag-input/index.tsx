import { UnstyledButton, Button } from 'components-library/button';
import { Icon } from 'components-library/icon';
import { Label } from 'components-library/input/input.styles';
import { ReactNode, useCallback, useState } from 'react';
import styled from 'styled-components';

const TagsInputWrapper = styled.div`
  border: ${(p) => p.theme.borderWidth} solid ${(p) => p.theme.color.text}66;
  border-radius: ${(p) => p.theme.borderRadius.input};
  border-radius: 3px;
  width: calc(100% - 26px);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 12px;
  margin-bottom: 12px;
  gap: 4px;
`;

const TagItem = styled.div`
  background-color: ${(p) => p.theme.color.primary};
  color: ${(p) => p.theme.color.buttonText};
  border-radius: ${(p) => p.theme.borderRadius.input};
  display: inline-block;
  padding: 4px 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TagItemCloseBtn = styled(UnstyledButton)`
  height: 18px;
  width: 18px;
  background-color: ${(p) => p.theme.color.background}66;
  color: ${(p) => p.theme.color.background};
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
  cursor: pointer;
  border: none;
`;

const InputTag = styled.input`
  flex-grow: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  color: ${(p) => p.theme.color.text};
  min-width: 300px;
`;

const TagText = styled.span`
  margin-left: 4px;
`;

const InputTagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const TagInputAndLabel = styled.div`
  width: 100%;
`;

const DeleteOptionButton = styled(Button)`
  color: ${(p) => p.theme.color.text};
`;

export const TagInput = ({
  label,
  onChange,
  value,
  removeTag,
  variantIndex,
  placeholder,
  removeOption,
}: {
  label: ReactNode;
  onChange: any;
  value: string[];
  variantIndex: number;
  removeTag: (args: any) => void;
  placeholder: string;
  removeOption: (args: any) => void;
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.target.value[e.target.value.length - 1] === ',') {
        // Get the value of the input
        const inputValueToProcess = e.target.value.slice(
          0,
          e.target.value.length - 1
        );
        // If the value is empty, return
        if (!inputValueToProcess.trim()) return;

        onChange({
          variantTags: [...value, inputValueToProcess],
          variantIndex,
        });
        setInputValue('');
        return;
      }
      setInputValue(e.target.value);
    },
    [onChange, value, variantIndex]
  );

  const handleRemoveTag = useCallback(
    (index: number) => {
      removeTag({ variantIndex, tagIndex: index });
    },
    [removeTag, variantIndex]
  );

  return (
    <InputTagContainer>
      <TagInputAndLabel>
        <Label>{label}</Label>

        <TagsInputWrapper>
          {value.map((tag, index) => (
            <TagItem key={tag}>
              <TagText>{tag}</TagText>
              <TagItemCloseBtn
                type="button"
                onClick={() => handleRemoveTag(index)}
              >
                <Icon name="close" />
              </TagItemCloseBtn>
            </TagItem>
          ))}

          <InputTag
            onChange={handleKeyDown}
            type="text"
            className="tags-input"
            placeholder={placeholder}
            value={inputValue}
          />
        </TagsInputWrapper>
      </TagInputAndLabel>

      <DeleteOptionButton
        type="button"
        secondary
        icon="delete_outline"
        onClick={() => removeOption(variantIndex)}
      />
    </InputTagContainer>
  );
};
