// status-translation.util.ts

export function getReservationStatusInSpanish(status: string): string {
  const statusTranslationMap: { [key: string]: string } = {
    Accepted: 'Aceptado',
    Pending: 'Pendiente',
    Rejected: 'Rechazado',
    'Picked Up': 'Recogido',
    Completed: 'Completado',
    Cancelled: 'Cancelado',
    Expired: 'Expirado',
  };

  return statusTranslationMap[status] || status;
}
