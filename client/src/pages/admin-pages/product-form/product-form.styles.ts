import styled from 'styled-components';
import { Button, UnstyledButton, UnstyledLink } from 'components-library';

export const FormWrapper = styled.form`
  max-width: 800px;
  margin: 40px auto;
`;

export const ImgWrapper = styled(UnstyledButton)`
  width: 100%;
  max-width: 200px;
  object-position: center;
  object-fit: cover;
  aspect-ratio: ${(p) => p.theme.products.image.aspectRatio};
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: ${(p) => p.theme.borderWidth} solid ${(p) => p.theme.color.text}66;
  font-size: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.color.lightGrey};
  position: relative;
  overflow: hidden;
`;

export const Img = styled.img`
  width: 100%;
  height: 100%;
  object-position: center;
  object-fit: cover;
  position: relative;
`;

export const AddImgBtn = styled(Button)`
  margin-left: 12px;
`;

export const ImgAndBtnWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  margin: 8px 0 12px;
`;

export const TokenGatingMasterLink = styled(UnstyledLink)`
  margin: 8px 12px 8px 0;
  padding: 8px;
  border: ${(p) => p.theme.borderWidth} solid;
  border-radius: ${(p) => p.theme.borderRadius.input};
  font-weight: bold;
`;

export const FormBtnWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ProductFormCardWrapper = styled.div`
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.lightGrey};
  margin-bottom: 20px;
`;

export const ProductFormCardTitle = styled.h3`
  margin: 0 0 16px;
  padding: 12px;
  font-size: 20px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
`;

export const ProductFormCardText = styled.p`
  color: ${(p) => p.theme.color.lightText};
  padding: 0 12px;
  font-size: 14px;
  margin-top: 4px;
`;

export const ProductFormCardContent = styled.div`
  padding: 0 12px;
`;

export const AddAnOptionBtnWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
`;

export const AddAnButton = styled(Button)``;

export const VariationInputsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
`;

export const VariantTableTitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
  padding: 12px 0;
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  font-weight: bold;
`;

export const VariationWrapper = styled.div`
  margin-top: 12px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};

  :last-of-type {
    border-bottom: none;
  }
`;

export const VariantsContentWrapper = styled.div`
  border-top: 1px solid ${(p) => p.theme.color.lightGrey};
  padding-top: 8px;
  margin-top: 40px;
`;

export const VariationName = styled.div`
  white-space: nowrap;
  padding: 12px 0;
`;

export const OptionInputs = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 8px;
  border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
  padding-bottom: 8px;
  margin-bottom: 12px;
`;

export const OptionTitle = styled.div`
  font-weight: bold;
`;

export const AlertWrapper = styled.div`
  padding: 8px;
  color: ${(p) => p.theme.color.danger};
  border: 1px solid ${(p) => p.theme.color.danger};
  background-color: ${(p) => p.theme.color.danger}11;
  border-radius: ${(p) => p.theme.borderRadius.default};
  margin: 8px 0;
  display: flex;
  align-items: center;
`;
