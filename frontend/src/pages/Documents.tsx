import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export default function Documents() {
  const qc = useQueryClient();
  const [showUpload, setShowUpload] = useState(false);
  const { data: docs = [] } = useQuery({ queryKey: ['documents'], queryFn: () => axios.get('/api/documents').then(r => r.data) });
  const remove = useMutation({ mutationFn: (id: number) => axios.delete(`/api/documents/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['documents'] }) });
  const getIcon = (type: string) => { if(type?.includes('pdf')) return '📄'; if(type?.includes('image')) return '🖼️'; if(type?.includes('word')) return '📝'; return '📁'; };
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold text-slate-900">Documents</h1><button onClick={() => setShowUpload(!showUpload)} className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg">Upload</button></div>
      {showUpload && <div className="bg-white rounded-xl border border-slate-200 p-5"><input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700" /><button className="mt-3 bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg" onClick={() => setShowUpload(false)}>Upload</button></div>}
      {!(docs as any[]).length ? <div className="text-center py-16 text-slate-400 text-sm">No documents yet.</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(docs as any[]).map((doc: any) => (
            <div key={doc.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-3">
              <span className="text-2xl">{getIcon(doc.file_type)}</span>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-800 truncate">{doc.title}</p><p className="text-xs text-slate-400 mt-0.5">{Math.round((doc.file_size||0)/1024)} KB</p></div>
              <button onClick={() => remove.mutate(doc.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
