import { useMutation } from '@apollo/client';
import {
  Button,
  Input,
  Textarea,
  message as messageComponent,
} from 'components-library';
import { CONTACT_STORE } from 'queries';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import styled from 'styled-components';
import { slideInBottom } from 'utils/keyframes';

const Form = styled.form`
  opacity: 0;
  animation: 0.4s ${slideInBottom} forwards;
`;

const NameAndEmail = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const SendMessageWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ContactStore = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [contactStore, { loading }] = useMutation(CONTACT_STORE);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.target.name === 'name') {
        setName(e.target.value);
        return;
      }
      if (e.target.name === 'email') {
        setEmail(e.target.value);
        return;
      }
      if (e.target.name === 'subject') {
        setSubject(e.target.value);
        return;
      }
      if (e.target.name === 'message') {
        setMessage(e.target.value);
        return;
      }
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      try {
        await contactStore({ variables: { name, email, subject, message } });
        messageComponent.success('Your message has been sent');

        // Reset the fields
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } catch (err) {
        messageComponent.error();
      }
    },
    [contactStore, email, message, name, subject]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Get in touch</h3>
      <div>
        <NameAndEmail>
          <div>
            <Input
              value={name}
              onChange={handleChange}
              name="name"
              placeholder="Enter your name"
              label="Name"
              required
              type="name"
            />
          </div>

          <div>
            <Input
              value={email}
              onChange={handleChange}
              name="email"
              placeholder="Enter your email"
              label="Email"
              required
              type="email"
            />
          </div>
        </NameAndEmail>

        <Input
          value={subject}
          onChange={handleChange}
          name="subject"
          placeholder="Enter the subject of the message"
          label="Subject"
          required
        />

        <div>
          <Textarea
            value={message}
            onChange={handleChange}
            name="message"
            placeholder="Enter your message"
            label="Message"
            required
            rows={10}
          />
        </div>
      </div>

      <SendMessageWrapper>
        <Button type="submit" isLoading={loading}>
          Send message
        </Button>
      </SendMessageWrapper>
    </Form>
  );
};
