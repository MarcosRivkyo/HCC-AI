export interface Study {
  id: string;
  studieName: string;
  status: string;
  studieDate: any;
  doctorName: string;
  patientName: string;
  clinicalDescription?: string;
  imagenUrl?: string | null;
  doctorId: string;
  predictionId?: string;
  pdfReportUrl?: string;
  sharedWithDoctorIds?: string[];
}
