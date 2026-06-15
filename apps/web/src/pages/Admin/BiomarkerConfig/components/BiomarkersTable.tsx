import { Button } from '@components/Button';
import { type Column, DataTable } from '@components/DataTable';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';

import type { BiomarkerWithConfig } from '@package/api';
import { theme } from '@package/ui';

interface BiomarkersTableProps {
  biomarkers: BiomarkerWithConfig[];
  onEdit: (biomarker: BiomarkerWithConfig) => void;
  onDelete: (biomarkerId: number) => void;
}

export function BiomarkersTable({ biomarkers, onEdit, onDelete }: BiomarkersTableProps) {
  if (biomarkers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Paragraph $variant="secondary">No biomarkers found</Paragraph>
      </div>
    );
  }

  const columns: Column<BiomarkerWithConfig>[] = [
    { id: 'name', header: 'Name', cell: (b: BiomarkerWithConfig) => b.name, width: '160px' },
    {
      id: 'display',
      header: 'Display Name',
      cell: (b: BiomarkerWithConfig) => b.display_name,
      width: '140px',
    },
    {
      id: 'category',
      header: 'Category',
      width: '140px',
      cell: (b: BiomarkerWithConfig) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            background: theme.colors.neutral[200],
            color: theme.colors.text.primary,
            whiteSpace: 'nowrap',
          }}
        >
          {b.category.name}
        </span>
      ),
    },
    {
      id: 'panels',
      header: 'Panels',
      width: '160px',
      cell: (b: BiomarkerWithConfig) => {
        if (b.kind === 'ratio' || b.kind === 'calculated') return null;

        const panels = b.panels ?? [];

        return (
          <>
            {panels.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {panels.slice(0, 2).map((p) => (
                  <span
                    key={p.panel_id}
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      background: theme.colors.accent.green.soft,
                      color: theme.colors.accent.green.strong,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {p.panel.code}
                  </span>
                ))}
                {panels.length > 2 && (
                  <span
                    style={{
                      padding: '2px 6px',
                      fontSize: '11px',
                      color: theme.colors.text.muted,
                    }}
                  >
                    +{panels.length - 2}
                  </span>
                )}
              </div>
            )}
            {panels.length === 0 && (
              <span style={{ color: theme.colors.text.muted, fontSize: '12px' }}>No panels</span>
            )}
          </>
        );
      },
    },
    { id: 'unit', header: 'Unit', cell: (b: BiomarkerWithConfig) => b.unit || '-', width: '70px' },
    {
      id: 'ref_male',
      header: 'Ref Male',
      cell: (b: BiomarkerWithConfig) =>
        b.ref_male_min !== null && b.ref_male_max !== null
          ? `${b.ref_male_min} - ${b.ref_male_max}`
          : '-',
    },
    {
      id: 'ref_female',
      header: 'Ref Female',
      cell: (b: BiomarkerWithConfig) =>
        b.ref_female_min !== null && b.ref_female_max !== null
          ? `${b.ref_female_min} - ${b.ref_female_max}`
          : '-',
    },
    {
      id: 'perf_male',
      header: 'Perf Male',
      cell: (b: BiomarkerWithConfig) =>
        b.performance_male_min !== null && b.performance_male_max !== null
          ? `${b.performance_male_min} - ${b.performance_male_max}`
          : '-',
    },
    {
      id: 'perf_female',
      header: 'Perf Female',
      cell: (b: BiomarkerWithConfig) =>
        b.performance_female_min !== null && b.performance_female_max !== null
          ? `${b.performance_female_min} - ${b.performance_female_max}`
          : '-',
    },
    {
      id: 'status',
      header: 'Status',
      cell: (b: BiomarkerWithConfig) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            background: b.is_active ? theme.colors.success.soft : theme.colors.neutral[200],
            color: b.is_active ? theme.colors.success.strong : theme.colors.text.secondary,
          }}
        >
          {b.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (b: BiomarkerWithConfig) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button $variant="ghost" $size="small" onClick={() => onEdit(b)} aria-label="Bewerken">
            <Icons.Edit aria-hidden="true" />
          </Button>
          <Button
            $variant="ghost"
            $size="small"
            onClick={() => onDelete(b.id)}
            aria-label="Verwijderen"
          >
            <Icons.Trash color={theme.colors.error.strong} aria-hidden="true" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable columns={columns} data={biomarkers} rowKey={(b) => String(b.id)} minWidth="1100px" />
  );
}
