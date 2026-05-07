export class CreateJobDto {
  company_id: string;
  title: string;
  department_id?: string;
  type?: string;
  location?: string;
  description?: string;
  requirements?: string;
  salary_range_min?: number;
  salary_range_max?: number;
  status?: string;
}
