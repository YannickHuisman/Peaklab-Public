import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';

import type { BiomarkerWithConfig } from '@package/api';

import { StyledLabel, StyledSelect } from '../styles';
import type { DependencyFormItem } from './types';

interface DependencySelectorProps {
  value: DependencyFormItem[];
  onChange: (value: DependencyFormItem[]) => void;
  availableBiomarkers: BiomarkerWithConfig[];
  excludeId?: number;
  formula: string;
  onFormulaChange: (formula: string) => void;
}

export function DependencySelector({
  value,
  onChange,
  availableBiomarkers,
  excludeId,
  formula,
  onFormulaChange,
}: DependencySelectorProps) {
  const options = availableBiomarkers.filter((b) => b.kind === 'direct' && b.id !== excludeId);

  const definedRoles = value.map((d) => d.role).filter((r) => r.trim() !== '');
  const autoFormula = definedRoles.length === 2 ? `${definedRoles[0]} / ${definedRoles[1]}` : null;

  const addRow = () => {
    onChange([...value, { source_id: 0, role: roleForIndex(value.length) }]);
  };

  const updateRow = (index: number, patch: Partial<DependencyFormItem>) => {
    const next = [...value];
    const current = next[index];

    if (!current) return;
    next[index] = { ...current, ...patch };
    onChange(next);
  };

  const removeRow = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <FlexColumn $gap="sm">
      <StyledLabel>Gekoppelde biomarkers</StyledLabel>
      <Paragraph $size="xsmall" $variant="secondary">
        Selecteer de biomarkers die nodig zijn om deze waarde te berekenen. De rol wordt als
        variabele gebruikt in de formule.
      </Paragraph>

      <FlexColumn $gap="sm">
        {value.map((dep, index) => (
          <FlexRow key={index} $gap="sm" $align="flex-end" $flexWrap="wrap">
            <FlexColumn $gap="xxs" $flex={2}>
              <StyledLabel>Biomarker</StyledLabel>
              <StyledSelect
                value={dep.source_id || ''}
                onChange={(e) => updateRow(index, { source_id: Number(e.target.value) })}
              >
                <option value="">Kies een biomarker...</option>
                {options.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.display_name}
                  </option>
                ))}
              </StyledSelect>
            </FlexColumn>
            <FlexColumn $gap="xxs" $flex={1}>
              <Input
                label="Rol"
                name={`role-${index}`}
                value={dep.role}
                onChange={(e) => updateRow(index, { role: (e.target as HTMLInputElement).value })}
                onBlur={() => undefined}
                placeholder="bijv. a, b, insuline"
              />
            </FlexColumn>
            <Button
              type="button"
              $variant="ghost"
              $size="small"
              onClick={() => removeRow(index)}
              aria-label="Verwijderen"
            >
              <Icons.Trash size="xs" aria-hidden="true" />
            </Button>
          </FlexRow>
        ))}

        <Button type="button" $variant="ghost" $size="small" onClick={addRow}>
          <Icons.Plus size="xs" /> Voeg gekoppelde biomarker toe
        </Button>
      </FlexColumn>

      <FlexColumn $gap="xxs">
        <Input
          label="Formule"
          name="formula"
          value={formula}
          onChange={(e) => onFormulaChange((e.target as HTMLInputElement).value)}
          onBlur={() => undefined}
          placeholder={autoFormula ? `Auto: ${autoFormula}` : 'bijv. (insuline * glucose) / 22.5'}
        />
        {definedRoles.length > 0 && (
          <FlexRow $gap="xs" $flexWrap="wrap">
            <Paragraph $size="xsmall" $variant="secondary">
              Beschikbare variabelen:
            </Paragraph>
            {definedRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onFormulaChange(formula ? `${formula} ${role}` : role)}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  border: '1px solid currentColor',
                  background: 'transparent',
                  cursor: 'pointer',
                  opacity: 0.7,
                }}
              >
                {role}
              </button>
            ))}
          </FlexRow>
        )}
        <Paragraph $size="xsmall" $variant="secondary">
          {autoFormula && !formula
            ? `Standaard: ${autoFormula}. Vul in om te overschrijven.`
            : 'Gebruik de rolnamen hierboven als variabelen. Toegestaan: + − × ÷ ( ) en Math.log / Math.log10.'}
        </Paragraph>
      </FlexColumn>
    </FlexColumn>
  );
}

function roleForIndex(index: number): string {
  return String.fromCharCode('a'.charCodeAt(0) + index);
}
