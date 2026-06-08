import { Button } from '@components/Button';
import { type Column, DataTable } from '@components/DataTable';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';

import type { Partner } from '@package/api';
import { theme } from '@package/ui';

interface PartnersTableProps {
  partners: Partner[];
  onEdit: (partner: Partner) => void;
  onDelete: (partnerId: string) => void;
}

const TYPE_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  trainer: {
    label: 'Trainer',
    bg: theme.colors.accent.green.soft,
    color: theme.colors.accent.green.strong,
  },
  expert: {
    label: 'Expert',
    bg: theme.colors.accent.blue.soft,
    color: theme.colors.accent.blue.strong,
  },
  supplement: {
    label: 'Supplement',
    bg: theme.colors.accent.magenta.soft,
    color: theme.colors.accent.magenta.strong,
  },
  clothing: {
    label: 'Clothing',
    bg: theme.colors.accent.teal.soft,
    color: theme.colors.accent.teal.strong,
  },
  other: {
    label: 'Other',
    bg: theme.colors.neutral[200],
    color: theme.colors.text.secondary,
  },
};

export function PartnersTable({ partners, onEdit, onDelete }: PartnersTableProps) {
  if (partners.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Paragraph $variant="secondary">No partners found</Paragraph>
      </div>
    );
  }

  const columns: Column<Partner>[] = [
    {
      id: 'name',
      header: 'Name',
      cell: (partner: Partner) => (
        <div>
          <div style={{ fontWeight: 500 }}>{partner.name}</div>
          {partner.subtitle && (
            <div style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
              {partner.subtitle}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'type',
      header: 'Type',
      cell: (partner: Partner) => {
        const typeInfo = TYPE_LABELS[partner.type] || TYPE_LABELS.other;

        return (
          <span
            style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              background: typeInfo.bg,
              color: typeInfo.color,
            }}
          >
            {typeInfo.label}
          </span>
        );
      },
    },
    {
      id: 'tags',
      header: 'Tags',
      cell: (partner: Partner) =>
        partner.tags && partner.tags.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {partner.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  background: theme.colors.neutral[200],
                  color: theme.colors.text.secondary,
                  whiteSpace: 'nowrap',
                }}
              >
                {tag}
              </span>
            ))}
            {partner.tags.length > 3 && (
              <span
                style={{
                  padding: '2px 6px',
                  fontSize: '11px',
                  color: theme.colors.text.muted,
                }}
              >
                +{partner.tags.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span style={{ color: theme.colors.text.muted, fontSize: '12px' }}>No tags</span>
        ),
    },
    {
      id: 'rating',
      header: 'Rating',
      cell: (partner: Partner) =>
        partner.rating !== null ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Icons.Zap size="xs" color={theme.colors.primary} />
            <span>{partner.rating.toFixed(1)}</span>
          </div>
        ) : (
          <span style={{ color: theme.colors.text.muted }}>–</span>
        ),
    },
    {
      id: 'price',
      header: 'Price',
      cell: (partner: Partner) =>
        partner.price_from !== null
          ? `€${partner.price_from.toFixed(0)}/${partner.price_unit}`
          : '–',
    },
    {
      id: 'featured',
      header: 'Featured',
      cell: (partner: Partner) => (
        <span
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            background: partner.is_featured ? theme.colors.success.soft : theme.colors.neutral[200],
            color: partner.is_featured ? theme.colors.success.strong : theme.colors.text.secondary,
          }}
        >
          {partner.is_featured ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (partner: Partner) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button $variant="ghost" $size="small" onClick={() => onEdit(partner)}>
            <Icons.Edit />
          </Button>
          <Button $variant="ghost" $size="small" onClick={() => onDelete(partner.id)}>
            <Icons.Trash color={theme.colors.error.strong} />
          </Button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={partners} rowKey={(p) => p.id} />;
}
