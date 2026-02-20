export class CreateAssetDto {
  company_id: string;
  employee_id?: string;
  name: string;
  type: string;
  serial_number?: string;
  purchase_date?: string;
  value?: number;
  status?: string;
  notes?: string;
}
