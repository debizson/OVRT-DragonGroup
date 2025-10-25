import { Link, useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, Sparkles, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import GenerateDialog from '../components/GenerateDialog';

export default function HomePage() {
  const navigate = useNavigate();
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);

  const handleLoadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            navigate('/editor', { state: { loadedMap: data } });
          } catch (error) {
            alert('Érvénytelen JSON fájl!');
            console.error('Error loading file:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleGenerate = (difficulty: 'easy' | 'medium' | 'hard' | 'very-hard') => {
    navigate(`/editor?mode=generate&difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            D&D Pálya Szerkesztő
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Készíts lenyűgöző térképeket D&D játékaidhoz. Egyedi alaprajzok, véletlenszerű generálás, 
            és részletes statisztikák egy helyen.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCard
            icon={<Plus className="w-12 h-12" />}
            title="Új térkép"
            description="Kezdj el egy új pályát létrehozni nulláról"
            link="/editor"
            color="bg-blue-500"
          />
          <FeatureCard
            icon={<Sparkles className="w-12 h-12" />}
            title="Generálás"
            description="Véletlenszerű pálya automatikus létrehozása"
            onClick={() => setShowGenerateDialog(true)}
            color="bg-purple-500"
          />
          <FeatureCard
            icon={<FolderOpen className="w-12 h-12" />}
            title="Betöltés"
            description="JSON fájl betöltése a mentett térképekből"
            onClick={handleLoadFile}
            color="bg-green-500"
          />
          <FeatureCard
            icon={<BarChart3 className="w-12 h-12" />}
            title="Statisztikák"
            description="Részletes elemzések a térképeidről"
            link="/stats"
            color="bg-orange-500"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Főbb funkciók</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Feature text="Négyzetrács alapú szerkesztés" />
            <Feature text="Véletlenszerű pálya generálás" />
            <Feature text="Mentés és betöltés" />
            <Feature text="Tárgyak elhelyezése (ajtó, bútorok, stb.)" />
            <Feature text="Feliratok hozzáadása" />
            <Feature text="Statisztikák készítése" />
            <Feature text="Nehézség megállapítása" />
            <Feature text="Karakterek és szörnyek kezelése" />
          </div>
        </div>
      </div>

      <GenerateDialog
        isOpen={showGenerateDialog}
        onClose={() => setShowGenerateDialog(false)}
        onGenerate={handleGenerate}
      />
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
  onClick?: () => void;
  color: string;
}

function FeatureCard({ icon, title, description, link, onClick, color }: FeatureCardProps) {
  const className = "bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-1";
  
  const content = (
    <>
      <div className={`${color} text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  return (
    <Link to={link || '#'} className={className}>
      {content}
    </Link>
  );
}

interface FeatureProps {
  text: string;
}

function Feature({ text }: FeatureProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}
