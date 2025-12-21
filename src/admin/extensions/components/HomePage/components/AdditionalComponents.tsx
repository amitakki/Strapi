/**
 * Additional Dashboard Components
 * - PendingReviews: Shows questions awaiting review
 * - ContentProgress: Shows progress by subject
 * - TopContributors: Leaderboard of content creators
 * 
 * Location: src/admin/extensions/components/HomePage/
 */

import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  Typography,
  Badge,
  ProgressBar,
  Flex,
} from '@strapi/design-system';
import { Clock, CheckCircle, ChartCircle, Crown } from '@strapi/icons';

// ============================================
// PENDING REVIEWS COMPONENT
// ============================================

interface PendingReviewsProps {
  count: number;
}

export const PendingReviews: React.FC<PendingReviewsProps> = ({ count }) => {
  const { get } = useFetchClient();
  const navigate = useNavigate();
  const [reviewItems, setReviewItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const { data } = await get('/content-manager/collection-types/api::question.question', {
        params: {
          page: 1,
          pageSize: 5,
          filters: {
            $or: [
              { reviewStatus: { $eq: 'peer_review' } },
              { reviewStatus: { $eq: 'qa' } },
            ],
          },
        },
      });
      setReviewItems(data.results || []);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAll = () => {
    navigate('/content-manager/collectionType/api::question.question?filters[$or][0][reviewStatus][$eq]=peer_review&filters[$or][1][reviewStatus][$eq]=qa');
  };

  return (
    <Card>
      <CardHeader>
        <Flex gap={2} alignItems="center">
          <Clock color="warning600" />
          <Typography variant="beta" fontWeight="bold">
            Pending Reviews
          </Typography>
          <Badge backgroundColor="warning100" textColor="warning700">
            {count}
          </Badge>
        </Flex>
      </CardHeader>
      <CardBody>
        {loading ? (
          <Flex justifyContent="center" padding={4}>
            <Typography>Loading...</Typography>
          </Flex>
        ) : reviewItems.length === 0 ? (
          <Flex direction="column" alignItems="center" gap={2} padding={8}>
            <CheckCircle color="success600" width="48px" height="48px" />
            <Typography variant="omega" textColor="success600" fontWeight="semiBold">
              All caught up!
            </Typography>
            <Typography variant="pi" textColor="neutral500" textAlign="center">
              No questions pending review
            </Typography>
          </Flex>
        ) : (
          <Flex direction="column" alignItems="stretch" gap={3}>
            {reviewItems.map((item) => (
              <Box
                key={item.id}
                padding={3}
                background="neutral100"
                borderRadius="4px"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/content-manager/collectionType/api::question.question/${item.id}`)}
              >
                <Flex direction="column" gap={2}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Typography variant="omega" fontWeight="semiBold" textColor="primary600">
                      {item.questionId || 'N/A'}
                    </Typography>
                    <Badge
                      backgroundColor="warning100"
                      textColor="warning700"
                      size="S"
                    >
                      {item.reviewStatus === 'peer_review' ? 'Review' : 'QA'}
                    </Badge>
                  </Flex>
                  <Typography variant="pi" textColor="neutral600">
                    {item.questionText?.substring(0, 60)}...
                  </Typography>
                </Flex>
              </Box>
            ))}

            {count > 5 && (
              <Box paddingTop={2}>
                <Typography
                  variant="pi"
                  textColor="primary600"
                  style={{ cursor: 'pointer' }}
                  onClick={handleViewAll}
                >
                  View all {count} pending reviews →
                </Typography>
              </Box>
            )}
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

// ============================================
// CONTENT PROGRESS COMPONENT
// ============================================

interface ContentProgressProps {
  questionsBySubject: {
    maths: number;
    english: number;
    verbal_reasoning: number;
    non_verbal_reasoning: number;
  };
  questionsByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

export const ContentProgress: React.FC<ContentProgressProps> = ({
  questionsBySubject,
  questionsByDifficulty,
}) => {
  // MVP target: 2,000 questions per subject (500 per subject for MVP)
  const TARGET_PER_SUBJECT = 500;

  const subjects = [
    {
      code: 'maths',
      name: 'Mathematics',
      emoji: '🔢',
      count: questionsBySubject.maths,
      color: 'primary',
    },
    {
      code: 'english',
      name: 'English',
      emoji: '📚',
      count: questionsBySubject.english,
      color: 'success',
    },
    {
      code: 'verbal_reasoning',
      name: 'Verbal Reasoning',
      emoji: '🧠',
      count: questionsBySubject.verbal_reasoning,
      color: 'warning',
    },
    {
      code: 'non_verbal_reasoning',
      name: 'Non-Verbal Reasoning',
      emoji: '🎨',
      count: questionsBySubject.non_verbal_reasoning,
      color: 'danger',
    },
  ];

  const totalDifficulty = questionsByDifficulty.easy + questionsByDifficulty.medium + questionsByDifficulty.hard;
  const difficultyDistribution = [
    {
      label: 'Easy',
      count: questionsByDifficulty.easy,
      percentage: totalDifficulty > 0 ? Math.round((questionsByDifficulty.easy / totalDifficulty) * 100) : 0,
      target: 40,
      color: 'success',
    },
    {
      label: 'Medium',
      count: questionsByDifficulty.medium,
      percentage: totalDifficulty > 0 ? Math.round((questionsByDifficulty.medium / totalDifficulty) * 100) : 0,
      target: 40,
      color: 'warning',
    },
    {
      label: 'Hard',
      count: questionsByDifficulty.hard,
      percentage: totalDifficulty > 0 ? Math.round((questionsByDifficulty.hard / totalDifficulty) * 100) : 0,
      target: 20,
      color: 'danger',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <Typography variant="beta" fontWeight="bold">
          Content Progress
        </Typography>
      </CardHeader>
      <CardBody>
        <Flex direction="column" alignItems="stretch" gap={6}>
          
          {/* Progress by Subject */}
          <Box>
            <Typography variant="sigma" textColor="neutral600" marginBottom={3}>
              QUESTIONS BY SUBJECT (Target: {TARGET_PER_SUBJECT} each)
            </Typography>
            <Flex direction="column" gap={4}>
              {subjects.map((subject) => {
                const percentage = Math.min(Math.round((subject.count / TARGET_PER_SUBJECT) * 100), 100);

                return (
                  <Box key={subject.code}>
                    <Flex justifyContent="space-between" alignItems="center" marginBottom={2}>
                      <Flex gap={2} alignItems="center">
                        <span style={{ fontSize: '20px' }}>{subject.emoji}</span>
                        <Typography variant="omega" fontWeight="semiBold">
                          {subject.name}
                        </Typography>
                      </Flex>
                      <Flex gap={2} alignItems="center">
                        <Typography variant="omega" textColor="neutral600">
                          {subject.count} / {TARGET_PER_SUBJECT}
                        </Typography>
                        <Badge
                          backgroundColor={`${subject.color}100`}
                          textColor={`${subject.color}700`}
                        >
                          {percentage}%
                        </Badge>
                      </Flex>
                    </Flex>
                    <ProgressBar value={percentage} size="M" />
                  </Box>
                );
              })}
            </Flex>
          </Box>

          {/* Difficulty Distribution */}
          <Box paddingTop={4} style={{ borderTop: '1px solid var(--strapi-color-neutral200)' }}>
            <Typography variant="sigma" textColor="neutral600" marginBottom={3}>
              DIFFICULTY DISTRIBUTION (Target: 40/40/20)
            </Typography>
            <Flex direction="column" gap={3}>
              {difficultyDistribution.map((diff) => {
                const isOnTarget = Math.abs(diff.percentage - diff.target) <= 5;
                
                return (
                  <Flex key={diff.label} justifyContent="space-between" alignItems="center">
                    <Flex gap={2} alignItems="center" style={{ flex: 1 }}>
                      <Typography variant="omega" style={{ minWidth: '80px' }}>
                        {diff.label}
                      </Typography>
                      <ProgressBar value={diff.percentage} size="S" style={{ flex: 1 }} />
                    </Flex>
                    <Flex gap={2} alignItems="center">
                      <Typography variant="pi" textColor="neutral600">
                        {diff.count} ({diff.percentage}%)
                      </Typography>
                      {isOnTarget ? (
                        <CheckCircle color="success600" width="16px" height="16px" />
                      ) : (
                        <ChartCircle color="warning600" width="16px" height="16px" />
                      )}
                    </Flex>
                  </Flex>
                );
              })}
            </Flex>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

// ============================================
// TOP CONTRIBUTORS COMPONENT
// ============================================

export const TopContributors: React.FC = () => {
  const { get } = useFetchClient();
  const [contributors, setContributors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopContributors();
  }, []);

  const fetchTopContributors = async () => {
    try {
      setLoading(true);
      
      // Fetch all questions and group by author
      const { data } = await get('/content-manager/collection-types/api::question.question', {
        params: {
          page: 1,
          pageSize: 10000, // Get all for stats
        },
      });

      const questions = data.results || [];
      
      // Count questions per author
      const authorCounts: Record<string, { name: string; count: number; published: number }> = {};
      
      questions.forEach((q: any) => {
        const authorName = q.createdBy?.username || 'Unknown';
        if (!authorCounts[authorName]) {
          authorCounts[authorName] = { name: authorName, count: 0, published: 0 };
        }
        authorCounts[authorName].count++;
        if (q.publishedAt) {
          authorCounts[authorName].published++;
        }
      });

      // Convert to array and sort by count
      const sorted = Object.values(authorCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5

      setContributors(sorted);
    } catch (error) {
      console.error('Error fetching contributors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (index: number) => {
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    return medals[index] || '📝';
  };

  return (
    <Card>
      <CardHeader>
        <Flex gap={2} alignItems="center">
          <Crown color="warning600" />
          <Typography variant="beta" fontWeight="bold">
            Top Contributors
          </Typography>
        </Flex>
      </CardHeader>
      <CardBody>
        {loading ? (
          <Flex justifyContent="center" padding={4}>
            <Typography>Loading...</Typography>
          </Flex>
        ) : contributors.length === 0 ? (
          <Flex direction="column" alignItems="center" gap={2} padding={8}>
            <Typography variant="omega" textColor="neutral500">
              No contributors yet
            </Typography>
          </Flex>
        ) : (
          <Flex direction="column" gap={3}>
            {contributors.map((contributor, index) => (
              <Box
                key={contributor.name}
                padding={3}
                background={index === 0 ? 'warning100' : 'neutral100'}
                borderRadius="4px"
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex gap={3} alignItems="center">
                    <span style={{ fontSize: '24px' }}>{getMedalEmoji(index)}</span>
                    <Flex direction="column">
                      <Typography variant="omega" fontWeight="semiBold">
                        {contributor.name}
                      </Typography>
                      <Typography variant="pi" textColor="neutral500">
                        {contributor.published} published
                      </Typography>
                    </Flex>
                  </Flex>
                  <Badge
                    backgroundColor={index === 0 ? 'warning200' : 'neutral200'}
                    textColor={index === 0 ? 'warning700' : 'neutral700'}
                  >
                    {contributor.count} questions
                  </Badge>
                </Flex>
              </Box>
            ))}
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};
