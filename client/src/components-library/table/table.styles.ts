import styled from 'styled-components';

export const TableWithBorder = styled.div`
  border-radius: ${(p) => p.theme.borderRadius.default};
  border: 1px solid ${(p) => p.theme.color.lightGrey};
  overflow: scroll;
`;

export const TableWrapper = styled.table`
  width: 100%;
  text-align: left;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 20px;
    border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
    border-right: 1px solid ${(p) => p.theme.color.lightGrey};
  }

  th:last-of-type,
  td:last-of-type {
    border-right: none;
  }

  th {
    border-bottom: 1px solid ${(p) => p.theme.color.lightGrey};
    background: ${(p) => p.theme.color.text}08;
  }

  tr:last-of-type td {
    border-bottom: none;
  }

  tbody tr {
    transition: 0.1s;

    :hover {
      background: ${(p) => p.theme.color.primary}08;
    }
  }
`;
