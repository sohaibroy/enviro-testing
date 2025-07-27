'use client';

import { useFormContext } from 'react-hook-form';
import { AnalytesTable } from '../components/analytes/AnalytesTable';
import AnalyteSearchTool from '../components/search/AnalyteSearchTool';
import { useState, useEffect } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Step4({ onNext, onBack, onStepChange }) {
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [analytes, setAnalytes] = useState([]);
  const [queryCriteria, setQueryCriteria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/analytes/active`);
        const data = await response.json();
        setAnalytes(data);
        setQueryCriteria('');
      } catch (err) {
        setFetchError('Could not load analytes, SOMETHING WRONG.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, []);

  const onSubmit = (data) => {
    onNext(data);
  };

  const handleAnalyteSelect = (analyteId) => {
    const analyte = analytes.find((a) => a.analyte_id === analyteId);
    if (!analyte) return;

    sessionStorage.setItem('selectedAnalyte', JSON.stringify(analyte));
    sessionStorage.removeItem('selectedTurnaround');
    sessionStorage.removeItem('selectedPrice');
    setValue('analytes', [analyte.analyte_name]);
    onNext();
  };

  return (
    <div className="min-h-screen flex items-start justify-center px-4 sm:px-6 lg:px-8 py-8">
      {/* Removed bg-gray-50 to keep original background */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-screen-xl bg-white shadow-xl p-6 sm:p-8 md:p-10 rounded-2xl space-y-6 mb-20"
      >
        <h2 className="text-2xl sm:text-3xl font-semibold text-center text-gray-800">
          Step 3: Analytes Data
        </h2>

        <AnalyteSearchTool
          onResults={(results, query, error) => {
            if (error) {
              setFetchError(error);
              setLoading(false);
              return;
            }

            setAnalytes(results);
            setQueryCriteria(query);
            setFetchError(null);
            setLoading(false);
          }}
        />

        {loading && <div className="text-gray-500 text-center">Loading analytes...</div>}
        {fetchError && <div className="text-red-600 text-center">{fetchError}</div>}

        {!loading && !fetchError && analytes && (
          <AnalytesTable
            analytes={analytes}
            queryCriteria={queryCriteria}
            onSelectAnalyte={handleAnalyteSelect}
          />
        )}

        <div className="flex flex-col md:flex-row flex-wrap justify-between items-stretch gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg px-6 py-3 rounded-lg transition-all"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem('skippedAnalytes', 'true');
              onStepChange(7);
            }}
            className="flex-1 bg-orange-400 hover:bg-orange-600 text-white text-lg px-6 py-3 rounded-lg transition-all"
          >
            Skip
          </button>

          <button
            type="submit"
            className="flex-1 bg-enviro_blue hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg transition-all"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}