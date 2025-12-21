/**
 * Recent Questions Component
 * Displays latest created/modified questions
 * 
 * Location: admin/src/pages/HomePage/components/RecentQuestions.tsx
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Typography,
  Flex,
  Badge,
  IconButton,
} from '@strapi/design-system';
import { Eye, Pencil, List } from '@strapi/icons';
import { format } from 'date-fns';

interface Question {
  id: string;
  questionId: string;
  questionText: string;
  subject: {
    code: string;
    name: string;
  };
  difficulty: string;
  reviewStatus: string;
  publishedAt: string | null;
  updatedAt: string;
  createdBy: {
    username: string;
  };
}

const getStatusBadge = (status: string, publishedAt: string | null) => {
  if (publishedAt) {
    return <Badge active backgroundColor="success100" textColor="success600">Published</Badge>;
  }

  const statusConfig: Record<string, { label: string; background: string; text: string }> = {
    draft: { label: 'Draft', background: 'neutral100', text: 'neutral600' },
    peer_review: { label: 'In Review', background: 'warning100', text: 'warning600' },
    editing: { label: 'Editing', background: 'secondary100', text: 'secondary600' },
    qa: { label: 'QA', background: 'primary100', text: 'primary600' },
    approved: { label: 'Approved', background: 'success100', text: 'success600' },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge backgroundColor={config.background} textColor={config.text}>
      {config.label}
    </Badge>
  );
};

const getDifficultyBadge = (difficulty: string) => {
  const config: Record<string, { emoji: string; background: string; text: string }> = {
    easy: { emoji: '😊', background: 'success100', text: 'success700' },
    medium: { emoji: '🤔', background: 'warning100', text: 'warning700' },
    hard: { emoji: '🔥', background: 'danger100', text: 'danger700' },
  };

  const { emoji, background, text } = config[difficulty] || config.medium;

  return (
    <Badge backgroundColor={background} textColor={text}>
      <span style={{ marginRight: '4px' }}>{emoji}</span>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  );
};

const getSubjectColor = (subjectCode: string) => {
  const colors: Record<string, string> = {
    maths: 'primary600',
    english: 'success600',
    verbal_reasoning: 'warning600',
    non_verbal_reasoning: 'danger600',
  };
  return colors[subjectCode] || 'neutral600';
};

const truncateText = (text: string, maxLength: number = 60) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const RecentQuestions: React.FC = () => {
  const { get } = useFetchClient();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentQuestions();
  }, []);

  const fetchRecentQuestions = async () => {
    try {
      setLoading(true);
      const { data } = await get('/content-manager/collection-types/api::question.question', {
        params: {
          page: 1,
          pageSize: 10,
          sort: 'updatedAt:desc',
        },
      });

      setQuestions(data.results || []);
    } catch (error) {
      console.error('Error fetching recent questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (questionId: string) => {
    navigate(`/content-manager/collectionType/api::question.question/${questionId}`);
  };

  const handleViewAll = () => {
    navigate('/content-manager/collectionType/api::question.question');
  };

  return (
    <Card>
      <CardHeader>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex gap={2} alignItems="center">
            <List />
            <Typography variant="beta" fontWeight="bold">
              Recent Questions
            </Typography>
          </Flex>
          <IconButton
            label="View all questions"
            onClick={handleViewAll}
            icon={<Eye />}
          />
        </Flex>
      </CardHeader>
      <CardBody>
        {loading ? (
          <Flex justifyContent="center" padding={4}>
            <Typography>Loading...</Typography>
          </Flex>
        ) : questions.length === 0 ? (
          <Flex justifyContent="center" padding={8} direction="column" alignItems="center" gap={2}>
            <Typography variant="omega" textColor="neutral500">
              No questions yet
            </Typography>
            <Typography variant="pi" textColor="neutral400">
              Create your first question using the quick actions above
            </Typography>
          </Flex>
        ) : (
          <Table colCount={6} rowCount={questions.length}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">ID</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Question</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Subject</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Difficulty</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Status</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Updated</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Actions</Typography>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {questions.map((question) => (
                <Tr key={question.id}>
                  <Td>
                    <Typography
                      variant="omega"
                      fontWeight="semiBold"
                      textColor="primary600"
                    >
                      {question.questionId || 'N/A'}
                    </Typography>
                  </Td>
                  <Td>
                    <Typography variant="omega">
                      {truncateText(question.questionText)}
                    </Typography>
                  </Td>
                  <Td>
                    <Typography
                      variant="omega"
                      textColor={getSubjectColor(question.subject?.code)}
                      fontWeight="semiBold"
                    >
                      {question.subject?.name || 'N/A'}
                    </Typography>
                  </Td>
                  <Td>
                    {getDifficultyBadge(question.difficulty)}
                  </Td>
                  <Td>
                    {getStatusBadge(question.reviewStatus, question.publishedAt)}
                  </Td>
                  <Td>
                    <Typography variant="pi" textColor="neutral500">
                      {format(new Date(question.updatedAt), 'MMM dd, yyyy')}
                    </Typography>
                    <Typography variant="pi" textColor="neutral400">
                      {format(new Date(question.updatedAt), 'HH:mm')}
                    </Typography>
                  </Td>
                  <Td>
                    <IconButton
                      label="Edit question"
                      icon={<Pencil />}
                      onClick={() => handleEdit(question.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}

        {questions.length > 0 && (
          <Box paddingTop={4}>
            <Flex justifyContent="center">
              <Typography
                variant="pi"
                textColor="primary600"
                style={{ cursor: 'pointer' }}
                onClick={handleViewAll}
              >
                View all questions →
              </Typography>
            </Flex>
          </Box>
        )}
      </CardBody>
    </Card>
  );
};
