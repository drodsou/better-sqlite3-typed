import {z} from 'zod';

// -- we don't use z.object as wrapper here, to have access to individual props
export const TablePersonZ = {
  name: z.string().min(1),
  year : z.number().min(1850).int(),
  sex: z.string().regex(/^[MFI]$/),
};

const ZTablePersonZ = z.object(TablePersonZ)
export type TablePerson = z.infer<typeof ZTablePersonZ>;