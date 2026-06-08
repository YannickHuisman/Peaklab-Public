import { useNavigate } from 'react-router-dom';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';

import { theme } from '@package/ui';

import { StyledArrowIcon, StyledSectionCard } from './styles';

export function Admin() {
  const navigate = useNavigate();

  const adminSections = [
    {
      title: 'User Management',
      description: 'Manage users, panels, blood tests, and biomarker results',
      icon: <Icons.Users size="xl" />,
      path: '/admin/users',
      color: theme.colors.accent.blue.main,
    },
    {
      title: 'Biomarker Configuration',
      description: 'Configure biomarkers, units, and reference ranges',
      icon: <Icons.Dna size="xl" />,
      path: '/admin/biomarker-config',
      color: theme.colors.accent.teal.main,
    },
    {
      title: 'Partner Management',
      description: 'Manage partners, trainers, experts, and affiliates',
      icon: <Icons.Handshake size="xl" />,
      path: '/admin/partners',
      color: theme.colors.accent.magenta.main,
    },
    {
      title: 'Partner aanvragen',
      description: 'Bekijk en beoordeel nieuwe partner aanvragen',
      icon: <Icons.Mail size="xl" />,
      path: '/admin/applications',
      color: theme.colors.accent.blue.main,
    },
    {
      title: 'Upload beheer',
      description: 'Bekijk en verwerk bloedresultaat uploads van gebruikers',
      icon: <Icons.Clipboard size="xl" />,
      path: '/admin/uploads',
      color: theme.colors.accent.orange.main,
    },
    {
      title: 'Lab beheer',
      description: 'Beheer labs en hun biomarker referentiewaarden per lab',
      icon: <Icons.Activity size="xl" />,
      path: '/admin/labs',
      color: theme.colors.accent.green.main,
    },
  ];

  return (
    <FlexColumn $gap="lg">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage system configuration and user data"
        backHref="/"
      />

      <Grid $gridMinWidth="300px" $gap="lg">
        {adminSections.map((section) => (
          <StyledSectionCard
            key={section.path}
            onClick={() => navigate(section.path)}
            $color={section.color}
            $padding="2xl"
            $showBorder
          >
            <FlexColumn $gap="md">
              <FlexRow $justify="space-between" $align="center">
                {section.icon}
                <StyledArrowIcon $hoverColor={section.color}>
                  <Icons.ArrowRight size="md" />
                </StyledArrowIcon>
              </FlexRow>
              <Heading $size="small">{section.title}</Heading>
              <Paragraph $variant="secondary" $size="small" $weight={400}>
                {section.description}
              </Paragraph>
            </FlexColumn>
          </StyledSectionCard>
        ))}
      </Grid>
    </FlexColumn>
  );
}
