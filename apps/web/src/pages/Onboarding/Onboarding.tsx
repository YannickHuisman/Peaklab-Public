import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { getClickableProps } from '@helpers/getClickableProps';

import { theme } from '@package/ui';

import {
  StyledButtonGroup,
  StyledChip,
  StyledConfirmCircle,
  StyledContainer,
  StyledOnboardingPage,
  StyledPanelCard,
  StyledProgress,
  StyledProgressBar,
  StyledProgressStep,
  StyledSuggestionChips,
} from './styles';

const SPORTS = ['Kracht', 'Endurance', 'Hybrid', 'Teamsport', 'Recreatief'];

const PANELS = [
  {
    code: 'strength',
    name: 'Peak Strength',
    for: 'Krachtsporters, powerlifters, bodybuilders',
    n: 15,
    focus: ['Testosteron', 'Cortisol', 'CK', 'Mineralen'],
    desc: 'Hormonen, herstel en mineralen voor spiergroei en krachtontwikkeling.',
  },
  {
    code: 'hybrid',
    name: 'Peak Hybrid',
    for: 'Functional fitness & Hyrox',
    n: 22,
    focus: ['Herstel', 'Stress', 'Energie'],
    desc: 'Uitgebalanceerde set voor wie kracht én conditie combineert.',
  },
  {
    code: 'endurance',
    name: 'Peak Endurance',
    for: 'Hardlopers, wielrenners, triatleten',
    n: 23,
    focus: ['IJzer', 'Zuurstof', 'Schildklier'],
    desc: 'IJzerstatus, zuurstoftransport en vermoeidheidspreventie voor duursport.',
  },
  {
    code: 'pro',
    name: 'Peak Pro',
    for: 'De serieuze atleet die alles wil weten',
    n: 27,
    focus: ['Compleet', 'Cholesterol', 'Lever'],
    desc: 'Combineert alle panels met extra markers voor een compleet beeld.',
    featured: true,
  },
];

const STEPS = ['Profiel', 'Doel', 'Panel', 'Klaar'];

const recommendedPanel = (sport: string): string => {
  switch (sport) {
    case 'Kracht':
      return 'strength';
    case 'Endurance':
      return 'endurance';
    case 'Hybrid':
      return 'hybrid';
    default:
      return 'pro';
  }
};

export function Onboarding() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [sport, setSport] = useState('Endurance');
  const [goal, setGoal] = useState('');
  const [panel, setPanel] = useState(recommendedPanel('Endurance'));

  // Auto-update panel when sport changes
  const handleSportChange = (s: string) => {
    setSport(s);
    setPanel(recommendedPanel(s));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setGoal(suggestion);
  };

  const handlePrev = () => {
    if (step === 0) {
      navigate('/');
    } else {
      setStep(step - 1);
    }
  };

  const handleNext = () => {
    if (step === 3) {
      navigate('/');
    } else {
      setStep(step + 1);
    }
  };

  return (
    <StyledOnboardingPage>
      <StyledContainer>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <Heading>PeakLab</Heading>
        </div>

        {/* Progress bar */}
        <StyledProgress>
          {STEPS.map((stepName, i) => (
            <div key={stepName} style={{ flex: 1 }}>
              <StyledProgressBar $active={i <= step} />
              <StyledProgressStep $active={i <= step}>{stepName}</StyledProgressStep>
            </div>
          ))}
        </StyledProgress>

        {/* Step 0: Sport Selection */}
        {step === 0 && (
          <FlexColumn $gap="lg">
            <FlexColumn $gap="sm">
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                Wat voor sporter ben je?
              </h1>
              <Paragraph $variant="secondary" style={{ fontSize: 14.5, lineHeight: 1.5 }}>
                Op basis hiervan stellen we het best passende biomarkerpanel voor.
              </Paragraph>
            </FlexColumn>

            <div style={{ background: theme.colors.surface, borderRadius: 18, padding: 26 }}>
              <Label>Primaire sport</Label>
              <StyledButtonGroup>
                {SPORTS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSportChange(s)}
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      padding: '10px 18px',
                      borderRadius: 11,
                      border: 'none',
                      cursor: 'pointer',
                      background: s === sport ? theme.colors.ink : theme.colors.bg,
                      color: s === sport ? '#fff' : theme.colors.ink60,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {s}
                  </button>
                ))}
              </StyledButtonGroup>
            </div>
          </FlexColumn>
        )}

        {/* Step 1: Goal Input */}
        {step === 1 && (
          <FlexColumn $gap="lg">
            <FlexColumn $gap="sm">
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                Wat is je doel?
              </h1>
              <Paragraph $variant="secondary" style={{ fontSize: 14.5, lineHeight: 1.5 }}>
                Wees specifiek en meetbaar — dit voedt je Performance Plan.
              </Paragraph>
            </FlexColumn>

            <div style={{ background: theme.colors.surface, borderRadius: 18, padding: 26 }}>
              <Label>Primair doel</Label>
              <input
                type="text"
                className="pl-field"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="bijv. Marathon sub 3:30 lopen"
                style={{
                  width: '100%',
                  fontFamily: theme.typography.fontFamily.primary,
                  fontSize: 15,
                  padding: '13px 15px',
                  borderRadius: 11,
                  border: 'none',
                  background: theme.colors.bg,
                  color: theme.colors.ink,
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: 14,
                }}
              />

              <StyledSuggestionChips>
                {['Marathon sub 3:30', 'Benchpress 100kg', 'Hyrox top 10%', 'Meer energie'].map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestionClick(s)}
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        padding: '7px 13px',
                        borderRadius: 99,
                        border: 'none',
                        background: theme.colors.bg,
                        color: theme.colors.ink60,
                        cursor: 'pointer',
                      }}
                    >
                      {s}
                    </button>
                  )
                )}
              </StyledSuggestionChips>
            </div>
          </FlexColumn>
        )}

        {/* Step 2: Panel Selection */}
        {step === 2 && (
          <FlexColumn $gap="lg">
            <FlexColumn $gap="sm">
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                Jouw aanbevolen panel
              </h1>
              <Paragraph $variant="secondary" style={{ fontSize: 14.5, lineHeight: 1.5 }}>
                Op maat voor{' '}
                <strong style={{ color: theme.colors.ink }}>{sport.toLowerCase()}</strong>. Je kunt
                ook een ander panel kiezen.
              </Paragraph>
            </FlexColumn>

            <FlexColumn $gap="sm">
              {PANELS.map((p) => {
                const isSelected = panel === p.code;
                const isRecommended = recommendedPanel(sport) === p.code;

                return (
                  <StyledPanelCard
                    key={p.code}
                    $selected={isSelected}
                    aria-pressed={isSelected}
                    {...getClickableProps(() => setPanel(p.code), p.name)}
                  >
                    <FlexRow $justify="space-between" $align="flex-start" $gap="md">
                      <FlexColumn $gap="sm">
                        <FlexRow $align="center" $gap="sm">
                          <span
                            style={{
                              fontFamily: theme.typography.fontFamily.primary,
                              fontSize: 17,
                              fontWeight: 700,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {p.name}
                          </span>
                          {isRecommended && <StyledChip>Aanbevolen</StyledChip>}
                        </FlexRow>

                        <div
                          style={{
                            fontSize: 13,
                            color: theme.colors.ink60,
                          }}
                        >
                          {p.for}
                        </div>

                        <div
                          style={{
                            fontSize: 13.5,
                            color: theme.colors.ink70,
                            lineHeight: 1.5,
                          }}
                        >
                          {p.desc}
                        </div>
                      </FlexColumn>

                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div
                          style={{
                            fontFamily: theme.typography.fontFamily.primary,
                            fontSize: 24,
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {p.n}
                        </div>
                        <Label>markers</Label>
                      </div>
                    </FlexRow>

                    <div
                      style={{
                        display: 'flex',
                        gap: 6,
                        marginTop: 14,
                        flexWrap: 'wrap',
                      }}
                    >
                      {p.focus.map((f) => (
                        <span
                          key={f}
                          style={{
                            fontSize: 11.5,
                            fontWeight: 600,
                            color: theme.colors.ink60,
                            background: theme.colors.bg,
                            borderRadius: 7,
                            padding: '4px 9px',
                          }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </StyledPanelCard>
                );
              })}
            </FlexColumn>
          </FlexColumn>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <FlexColumn $gap="lg" $align="center" style={{ paddingTop: 20 }}>
            <StyledConfirmCircle>
              <Icons.Check size={30} color={theme.colors.performance} strokeWidth={2.2} />
            </StyledConfirmCircle>

            <FlexColumn $gap="sm" $align="center">
              <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
                Je profiel staat klaar
              </h1>
              <Paragraph
                $variant="secondary"
                $align="center"
                style={{ fontSize: 14.5, lineHeight: 1.55, maxWidth: 420 }}
              >
                We hebben het{' '}
                <strong style={{ color: theme.colors.ink }}>
                  {PANELS.find((p) => p.code === panel)?.name}
                </strong>{' '}
                geselecteerd. Plan je bloedtest en je dashboard vult zich automatisch.
              </Paragraph>
            </FlexColumn>

            <Button onClick={handleNext} style={{ padding: '13px 24px' }}>
              <FlexRow $gap="sm" $align="center">
                <Icons.Calendar size="sm" />
                <span>Naar dashboard</span>
              </FlexRow>
            </Button>
          </FlexColumn>
        )}

        {/* Navigation buttons */}
        {step < 3 && (
          <FlexRow $justify="space-between" $align="center" style={{ marginTop: 28 }}>
            <button
              onClick={handlePrev}
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: theme.colors.ink60,
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                padding: 0,
              }}
            >
              {step === 0 ? 'Annuleren' : 'Vorige'}
            </button>

            <Button onClick={handleNext}>
              <FlexRow $gap="sm" $align="center">
                <span>Volgende</span>
                <Icons.ArrowRight size="sm" />
              </FlexRow>
            </Button>
          </FlexRow>
        )}
      </StyledContainer>
    </StyledOnboardingPage>
  );
}

// Label component for form fields
function Label({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 13,
        fontWeight: 600,
        color: theme.colors.ink,
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  );
}
