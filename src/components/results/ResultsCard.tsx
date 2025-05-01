import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ArrowLeft, 
  ZapOff, 
  Shield, 
  Waves, 
  AlertTriangle, 
  Ruler, 
  Settings,
  CheckCircle2,
  Download,
  ListChecks
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

import Card from '../ui/Card';
import Button from '../ui/Button';
import { useSelector } from '../../context/SelectorContext';
import { getPPERequirements, ArcFlashData } from '../../lib/supabase';
import { arcFlashPPE } from '../../lib/ppe-requirements';

const ResultsCard: React.FC = () => {
  const {
    voltageRange,
    equipment,
    taskCategory,
    specificTask,
    properlyMaintained,
    useAdvancedParams,
    resetSelections
  } = useSelector();

  const [ppeData, setPpeData] = useState<ArcFlashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPPERequirements() {
      if (!voltageRange || !equipment || !taskCategory || !specificTask) {
        setError('Missing selection data. Please go back and complete all steps.');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getPPERequirements(
          voltageRange,
          equipment,
          taskCategory,
          specificTask,
          useAdvancedParams
        );
        setPpeData(data);
      } catch (err) {
        console.error('Error loading PPE requirements:', err);
        setError('Failed to load PPE requirements. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadPPERequirements();
  }, [voltageRange, equipment, taskCategory, specificTask, useAdvancedParams]);

  const handleExport = async () => {
    if (!page1Ref.current) {
      setError('Export elements not ready. Please try again.');
      return;
    }
    
    setExporting(true);
    try {
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;

      // Helper function to safely process and add an image to the PDF
      const processPageCanvas = async (element: HTMLDivElement, pageNum: number, totalPages: number) => {
        let canvas;
        try {
          // Make element temporarily visible for rendering
          const originalDisplay = element.style.display;
          element.style.display = 'block';
          element.style.position = 'absolute';
          element.style.top = '0';
          element.style.left = '0';
          element.style.zIndex = '-1000';

          canvas = await html2canvas(element, {
            scale: 2,
            logging: true,
            backgroundColor: '#ffffff',
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
            useCORS: false,
            allowTaint: true,
            onclone: (clonedDoc) => {
              const clonedElement = clonedDoc.querySelector(`[data-page="${pageNum}"]`);
              if (clonedElement) {
                (clonedElement as HTMLElement).style.display = 'block';
              }
            }
          });

          // Restore original display
          element.style.display = originalDisplay;
          element.style.position = 'static';
        } catch (err) {
          console.error('Error rendering canvas:', err);
          throw new Error(`Failed to render page ${pageNum} canvas.`);
        }

        return new Promise<void>((resolve, reject) => {
          try {
            const imgData = canvas.toDataURL('image/png', 1.0);

            // Validate image data
            if (!imgData || typeof imgData !== 'string') {
              throw new Error('Image data was not generated properly.');
            }

            const img = new Image();
            img.src = imgData;

            img.onload = () => {
              try {
                const imgWidth = pageWidth - (2 * margin);
                const imgHeight = (img.height * imgWidth) / img.width;

                // Check for invalid values
                if (!imgHeight || !imgWidth || isNaN(imgHeight) || isNaN(imgWidth)) {
                  throw new Error('Invalid image dimensions for PDF export.');
                }

                // Add page if not first page
                if (pageNum > 1) {
                  pdf.addPage();
                }

                // Add image to page
                pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);

                // Add footer
                pdf.setFontSize(8);
                pdf.setTextColor(128, 128, 128);
                
                const date = new Date().toLocaleDateString();
                const disclaimer = 'This document is generated based on NFPA 70E guidelines. Always follow your company\'s safety policies.';
                const pageInfo = `Generated on ${date} | Page ${pageNum} of ${totalPages}`;
                
                pdf.text(disclaimer, margin, pageHeight - 10);
                pdf.text(pageInfo, pageWidth - margin, pageHeight - 10, { align: 'right' });

                resolve();
              } catch (err) {
                reject(err);
              }
            };

            img.onerror = () => {
              reject(new Error('Failed to load image data.'));
            };
          } catch (err) {
            reject(err);
          }
        });
      };

      // Process pages based on PPE requirement
      await processPageCanvas(page1Ref.current, 1, isPPERequired ? 2 : 1);
      
      if (isPPERequired && page2Ref.current) {
        await processPageCanvas(page2Ref.current, 2, 2);
      }

      // Save the PDF
      pdf.save('ArcFlashResults.pdf');
    } catch (err) {
      console.error('Error exporting results:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-6">
        <div className="animate-pulse">
          <div className="flex justify-center mb-3">
            <Shield size={48} className="text-gray-300" />
          </div>
          <p className="text-gray-500">Loading PPE requirements...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-6">
        <div className="text-danger-600 mb-3">
          <AlertTriangle size={48} className="mx-auto mb-3" />
          <p>{error}</p>
        </div>
        <Link to="/selector">
          <Button variant="primary">
            <ArrowLeft size={16} className="mr-2" />
            Back to Selector
          </Button>
        </Link>
      </Card>
    );
  }

  if (!ppeData) {
    return (
      <Card className="max-w-2xl mx-auto text-center py-6">
        <div className="text-danger-600 mb-3">
          <AlertTriangle size={48} className="mx-auto mb-3" />
          <p>No PPE requirements found for the selected criteria. Please try different selections.</p>
        </div>
        <Link to="/selector">
          <Button variant="primary">
            <ArrowLeft size={16} className="mr-2" />
            Back to Selector
          </Button>
        </Link>
      </Card>
    );
  }

  const isPPERequired = !(
    ppeData.likelihood_of_occurrence === 'No' && properlyMaintained
  );

  const category = parseInt(ppeData.arc_flash_ppe_category);
  const requiredPPE = arcFlashPPE[category as keyof typeof arcFlashPPE];

  const Page1Content = () => (
    <div className="bg-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Arc Flash PPE Requirements</h1>
        <p className="text-gray-600">Based on NFPA 70E Guidelines</p>
      </div>

      <div className="mb-6">
        <h2 className="text-base font-semibold mb-3 flex items-center">
          <Settings className="mr-2 text-primary-500" size={16} />
          Selected Parameters
        </h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Voltage Range</p>
              <p className="text-sm font-medium">{voltageRange}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Equipment</p>
              <p className="text-sm font-medium">{equipment}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Task Category</p>
              <p className="text-sm font-medium">{taskCategory}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Specific Task</p>
              <p className="text-sm font-medium">{specificTask}</p>
            </div>
          </div>
        </div>
      </div>

      {isPPERequired ? (
        <>
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3 flex items-center">
              <ShieldAlert className="mr-2 text-warning-500" size={16} />
              PPE Requirements
            </h2>
            <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-warning-500 text-white flex items-center justify-center">
                  <span className="text-xl font-bold leading-none">{ppeData.arc_flash_ppe_category}</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold">Arc Flash PPE Category</h3>
                  <p className="text-sm text-gray-700">Category {ppeData.arc_flash_ppe_category}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3 flex items-center">
              <Ruler className="mr-2 text-primary-500" size={16} />
              Arc Flash Boundary
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-base font-medium text-blue-800">{ppeData.arc_flash_boundary}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3 flex items-center">
              <ListChecks className="mr-2 text-primary-500" size={16} />
              Required PPE
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <ul className="space-y-2">
                {requiredPPE.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 
                      className="text-success-600 flex-shrink-0 mt-1" 
                      size={14}
                    />
                    <span className={`${index === 0 ? "font-semibold" : ""} leading-snug`}>
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-6">
          <h2 className="text-base font-semibold mb-3 flex items-center">
            <ZapOff className="mr-2 text-success-700" size={16} />
            PPE Requirements
          </h2>
          <div className="bg-success-50 p-4 rounded-lg border border-success-200">
            <div className="flex items-center">
              <CheckCircle2 className="text-success-700 mr-3 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-success-800 mb-1">
                  No arc flash PPE is required for this task
                </h3>
                <p className="text-sm text-success-700">
                  This determination is based on the task having a "No" likelihood of occurrence and the equipment being properly maintained.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const Page2Content = () => (
    <div className="bg-white">
      {isPPERequired && (
        <>
          <div className="mb-6">
            <h2 className="text-base font-semibold mb-3 flex items-center">
              <Waves className="mr-2 text-primary-500" size={16} />
              Parameters
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">{ppeData.parameters}</p>
            </div>
          </div>
          
          <div className="p-4 bg-success-50 rounded-lg border border-success-200">
            <div className="flex items-start">
              <AlertTriangle className="text-success-700 mr-3 mt-0.5 flex-shrink-0" size={16} />
              <div>
                <h3 className="text-sm font-semibold text-success-800 mb-1">Important Safety Reminder</h3>
                <p className="text-sm text-success-700">
                  Always inspect PPE before use and follow all applicable safety protocols and procedures.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={page1Ref} data-page="1" className="w-[210mm] p-[15mm] bg-white">
          <Page1Content />
        </div>
        {isPPERequired && (
          <div ref={page2Ref} data-page="2" className="w-[210mm] p-[15mm] bg-white">
            <Page2Content />
          </div>
        )}
      </div>

      <Card className="max-w-2xl mx-auto p-4 sm:p-6">
        <Page1Content />
        {isPPERequired && <Page2Content />}
        
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <Link to="/selector">
            <Button variant="outline" className="w-full sm:w-auto px-4 py-2">
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button
              variant="primary"
              onClick={handleExport}
              disabled={exporting}
              className="w-full sm:w-auto px-4 py-2"
            >
              <Download size={16} className="mr-2" />
              {exporting ? 'Exporting...' : 'Export'}
            </Button>
            <Link 
              to="/selector" 
              onClick={resetSelections}
              className="w-full sm:w-auto"
            >
              <Button variant="primary" className="w-full px-4 py-2">
                Start New
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
};

export default ResultsCard;