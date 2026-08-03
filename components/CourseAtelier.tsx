'use client';

import { useState } from 'react';
import { 
  Layout, Palette, Maximize2, Shield, Layers, 
  ChevronLeft, Play, X, Check
} from 'lucide-react';

// ============================================
// CONTENU PÉDAGOGIQUE (FRANÇAIS)
// ============================================

const LESSON_DATA = {
  flexbox: {
    label: 'Flexbox',
    icon: Layout,
    bcSub: 'Flexbox',
    title: 'Maîtriser l\'espace.',
    desc: 'Le flexbox est un outil de mise en page puissant. Il permet de distribuer l\'espace entre les éléments de manière fluide et prévisible.',
    deep: `<p>Le module <strong>Flexbox</strong> (Flexible Box Layout) a été conçu pour organiser les éléments dans un conteneur, que ce soit en ligne ou en colonne. Il répartit l'espace disponible et aligne les éléments selon vos directives.</p>
           <p>L'une des propriétés les plus appréciées est <code class="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded text-[0.8rem] font-mono">gap</code>. Elle définit l'espace entre les éléments enfants, sans toucher aux marges extérieures.</p>`,
    ctrlTitle: 'L\'écart (Gap)',
    ctrlDesc: 'Faites glisser le curseur ci-dessous pour voir comment la propriété <code class="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded text-[0.8rem] font-mono">gap</code> influence l\'espace entre les boîtes.',
    footerText: 'En ajustant ce paramètre, vous modifiez la structure visuelle sans toucher au contenu HTML.',
    rangeMin: 'Compact',
    rangeMax: 'Aéré',
    codeProp: 'gap',
    codeValue: '20px',
    codeMode: 'Flexbox Gap',
    sliderMax: 80,
    defaultVal: 20,
    keyPoints: [
      '<code class="text-orange-600 dark:text-orange-400 font-mono text-xs">gap</code> ne s\'applique qu\'entre les éléments.',
      'Le flexbox répartit l\'espace de manière automatique.',
      'Utilisez <code class="text-orange-600 dark:text-orange-400 font-mono text-xs">justify-content</code> pour l\'alignement.'
    ],
    updatePreview: (val: number, styles: any) => {
      styles.container.gap = `${val}px`;
      styles.container.display = 'flex';
      styles.container.flexDirection = 'row';
      styles.box1.width = '3.5rem'; styles.box2.width = '3.5rem'; styles.box3.width = '3.5rem';
      styles.box1.backgroundColor = '#2A52BE'; styles.box2.backgroundColor = '#E27B58'; styles.box3.backgroundColor = '#1A1C20';
      return `${val}px`;
    }
  },
  colors: {
    label: 'Couleurs',
    icon: Palette,
    bcSub: 'Couleurs',
    title: 'La palette vivante.',
    desc: 'Les couleurs définissent l\'émotion de votre design. Avec le modèle HSL, vous contrôlez précisément chaque nuance.',
    deep: `<p>La couleur est un élément essentiel du design. Le modèle <strong>HSL</strong> (Hue, Saturation, Lightness) est particulièrement apprécié pour sa logique naturelle.</p>
           <p>La <strong>teinte</strong> (Hue) détermine la couleur pure. La <strong>saturation</strong> contrôle l'intensité. La <strong>luminosité</strong> gère la clarté. Dans cet exercice, nous modifions la teinte tout en gardant une saturation et une lumière constantes.</p>`,
    ctrlTitle: 'La teinte (Hue)',
    ctrlDesc: 'Faites glisser le curseur pour parcourir le cercle chromatique. La teinte change, la saturation et la lumière restent stables (70% et 60%).',
    footerText: 'Le modèle HSL est souvent plus intuitif que le RGB pour designer.',
    rangeMin: 'Froid',
    rangeMax: 'Chaud',
    codeProp: 'background-color',
    codeValue: 'hsl(200, 70%, 60%)',
    codeMode: 'Colors HSL',
    sliderMax: 360,
    defaultVal: 200,
    keyPoints: [
      'HSL = Teinte, Saturation, Luminosité.',
      'La teinte est un angle (0° = rouge, 120° = vert).',
      'Utilisez <code class="text-orange-600 dark:text-orange-400 font-mono text-xs">hsla()</code> pour la transparence.'
    ],
    updatePreview: (val: number, styles: any) => {
      styles.container.gap = '1rem';
      styles.container.display = 'flex';
      styles.container.flexDirection = 'row';
      styles.box1.width = '3.5rem'; styles.box2.width = '3.5rem'; styles.box3.width = '3.5rem';
      styles.box1.backgroundColor = `hsl(${val}, 70%, 60%)`;
      styles.box2.backgroundColor = `hsl(${val+60}, 70%, 60%)`;
      styles.box3.backgroundColor = `hsl(${val+120}, 70%, 60%)`;
      return `hsl(${val}, 70%, 60%)`;
    }
  },
  size: {
    label: 'Taille',
    icon: Maximize2,
    bcSub: 'Taille',
    title: 'Les dimensions.',
    desc: 'La taille des éléments est cruciale pour l\'équilibre visuel et la hiérarchie de l\'information.',
    deep: `<p>La taille des éléments est l'un des piliers de la hiérarchie visuelle. Un élément plus grand attire immédiatement l'attention.</p>
           <p>En CSS, le <code class="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded text-[0.8rem] font-mono">width</code> peut être défini en <strong>unités absolues</strong> (<code class="font-mono text-xs">px</code>) ou en <strong>unités relatives</strong> (<code class="font-mono text-xs">%</code>). Les pourcentages sont relatifs au conteneur parent.</p>`,
    ctrlTitle: 'La largeur (Width)',
    ctrlDesc: 'Ajustez la largeur de la première boîte (en pourcentage). Les autres conservent leur taille pour comparer.',
    footerText: 'En utilisant des pourcentages, vos éléments s\'adaptent à la taille de l\'écran. C\'est la base du responsive.',
    rangeMin: 'Étroit',
    rangeMax: 'Large',
    codeProp: 'width',
    codeValue: '40%',
    codeMode: 'Width Units',
    sliderMax: 100,
    defaultVal: 40,
    keyPoints: [
      '<code class="text-orange-600 dark:text-orange-400 font-mono text-xs">%</code> est relatif au parent.',
      '<code class="text-orange-600 dark:text-orange-400 font-mono text-xs">px</code> est une unité absolue.',
      'La taille guide le regard de l\'utilisateur.'
    ],
    updatePreview: (val: number, styles: any) => {
      styles.container.gap = '1rem';
      styles.container.display = 'flex';
      styles.container.flexDirection = 'row';
      styles.box1.width = `${val}%`;
      styles.box2.width = '3.5rem';
      styles.box3.width = '3.5rem';
      styles.box1.backgroundColor = '#2A52BE'; styles.box2.backgroundColor = '#E27B58'; styles.box3.backgroundColor = '#1A1C20';
      return `${val}%`;
    }
  },
  shadows: {
    label: 'Ombres',
    icon: Shield,
    bcSub: 'Ombres',
    title: 'La profondeur.',
    desc: 'Les ombres apportent du relief et de la profondeur à vos interfaces, guidant le regard de l\'utilisateur.',
    deep: `<p>Les ombres (<code class="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded text-[0.8rem] font-mono">box-shadow</code>) sont un outil puissant pour simuler la profondeur. Elles aident à différencier les éléments.</p>
           <p>La propriété prend plusieurs valeurs : le décalage X, le décalage Y, le flou (blur), l'étalement, et la couleur. Le flou détermine la douceur de l'ombre.</p>`,
    ctrlTitle: 'Le flou (Blur)',
    ctrlDesc: 'Augmentez le flou de l\'ombre pour voir la profondeur s\'accentuer. La couleur de l\'ombre utilise un canal alpha.',
    footerText: 'Une ombre subtile suggère un élément flottant, une ombre diffuse crée une ambiance plus douce.',
    rangeMin: 'Plat',
    rangeMax: 'Profond',
    codeProp: 'box-shadow',
    codeValue: '0 4px 10px rgba(0,0,0,0.2)',
    codeMode: 'Shadow Blur',
    sliderMax: 40,
    defaultVal: 10,
    keyPoints: [
      '<code class="text-orange-600 dark:text-orange-400 font-mono text-xs">box-shadow</code> : X, Y, flou, étalement, couleur.',
      'Le canal Alpha est crucial pour des ombres réalistes.',
      'Jouez sur le flou pour créer de la profondeur.'
    ],
    updatePreview: (val: number, styles: any) => {
      styles.container.gap = '1rem';
      styles.container.display = 'flex';
      styles.container.flexDirection = 'row';
      styles.box1.width = '3.5rem'; styles.box2.width = '3.5rem'; styles.box3.width = '3.5rem';
      styles.box1.backgroundColor = '#2A52BE'; styles.box2.backgroundColor = '#E27B58'; styles.box3.backgroundColor = '#1A1C20';
      let shadow = `0 4px ${val}px rgba(0,0,0,${Math.min(0.1 + val/100, 0.6)})`;
      styles.box1.boxShadow = shadow; styles.box2.boxShadow = shadow; styles.box3.boxShadow = shadow;
      return shadow;
    }
  },
  display: {
    label: 'Display',
    icon: Layers,
    bcSub: 'Display',
    title: 'Le flux des éléments.',
    desc: 'La propriété `display` détermine comment un élément est affiché dans le flux de la page.',
    deep: `<p>La propriété <code class="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded text-[0.8rem] font-mono">display</code> est l'un des concepts fondamentaux.</p>
           <p><strong>Block</strong> : L'élément occupe toute la largeur disponible et provoque un saut de ligne.</p>
           <p><strong>Inline</strong> : L'élément ne prend que la largeur nécessaire et s'aligne sur la même ligne.</p>
           <p><strong>Inline-block</strong> : Un hybride. S'aligne en ligne, mais on peut définir sa largeur et sa hauteur.</p>`,
    ctrlTitle: 'Les modes d\'affichage',
    ctrlDesc: 'Sélectionnez un mode pour voir comment les boîtes réagissent.',
    footerText: 'Choisir le bon mode d\'affichage est essentiel pour structurer vos pages.',
    rangeMin: 'Block',
    rangeMax: 'Inline',
    codeProp: 'display',
    codeValue: 'flex',
    codeMode: 'Display Mode',
    sliderMax: 1,
    defaultVal: 0,
    keyPoints: [
      '<code class="text-orange-600 dark:text-orange-400 font-mono text-xs">block</code> : toute la largeur, saut de ligne.',
      '<code class="text-orange-600 dark:text-orange-400 font-mono text-xs">inline</code> : largeur minimale, pas de saut.',
      '<code class="text-orange-600 dark:text-orange-400 font-mono text-xs">inline-block</code> : s\'aligne en ligne, accepte largeur/hauteur.'
    ],
    updatePreview: (val: string, styles: any) => {
      styles.container.gap = '0.5rem';
      styles.box1.width = 'auto'; styles.box2.width = 'auto'; styles.box3.width = 'auto';
      styles.box1.backgroundColor = '#2A52BE'; styles.box2.backgroundColor = '#E27B58'; styles.box3.backgroundColor = '#1A1C20';
      styles.box1.boxShadow = 'none'; styles.box2.boxShadow = 'none'; styles.box3.boxShadow = 'none';
      styles.box1.marginBottom = '0'; styles.box2.marginBottom = '0'; styles.box3.marginBottom = '0';
      
      if (val === 'block') {
        styles.container.display = 'flex';
        styles.container.flexDirection = 'column';
        styles.box1.width = '100%'; styles.box2.width = '100%'; styles.box3.width = '100%';
        styles.box1.marginBottom = '0.25rem'; styles.box2.marginBottom = '0.25rem';
      } else if (val === 'inline') {
        styles.container.display = 'block';
        styles.container.flexDirection = 'row';
        styles.box1.display = 'inline'; styles.box2.display = 'inline'; styles.box3.display = 'inline';
      } else if (val === 'inline-block') {
        styles.container.display = 'block';
        styles.container.flexDirection = 'row';
        styles.box1.display = 'inline-block'; styles.box2.display = 'inline-block'; styles.box3.display = 'inline-block';
        styles.box1.width = '80px'; styles.box2.width = '80px'; styles.box3.width = '80px';
      }
      return val;
    }
  }
};

export default function CourseAtelier() {
  const [activeTopic, setActiveTopic] = useState<'flexbox' | 'colors' | 'size' | 'shadows' | 'display'>('flexbox');
  const [sliderValue, setSliderValue] = useState(20);
  const [displayMode, setDisplayMode] = useState('block');
  const [stampActive, setStampActive] = useState(false);

  const topicKeys = Object.keys(LESSON_DATA) as (keyof typeof LESSON_DATA)[];
  const currentData = LESSON_DATA[activeTopic];

  // Style dynamique pour la preview
  const [previewStyles, setPreviewStyles] = useState({
    container: { gap: '20px', display: 'flex', flexDirection: 'row' as const },
    box1: { width: '3.5rem', backgroundColor: '#2A52BE', boxShadow: 'none', display: 'block', marginBottom: '0' },
    box2: { width: '3.5rem', backgroundColor: '#E27B58', boxShadow: 'none', display: 'block', marginBottom: '0' },
    box3: { width: '3.5rem', backgroundColor: '#1A1C20', boxShadow: 'none', display: 'block', marginBottom: '0' }
  });

  // Mise à jour des styles lors du changement de valeur
  const handleSliderChange = (val: number) => {
    setSliderValue(val);
    const result = currentData.updatePreview(val, previewStyles);
    setPreviewStyles({ ...previewStyles }); // Forcer le re-render
    document.getElementById('sliderDisplay')!.textContent = result;
  };

  const handleDisplayChange = (val: string) => {
    setDisplayMode(val);
    const result = currentData.updatePreview(val, previewStyles);
    setPreviewStyles({ ...previewStyles });
    document.getElementById('sliderDisplay')!.textContent = result;
  };

  // Changement de sujet
  const switchTopic = (topic: keyof typeof LESSON_DATA) => {
    setActiveTopic(topic);
    const data = LESSON_DATA[topic];
    
    // Réinitialiser les styles de preview
    setPreviewStyles({
      container: { gap: '1rem', display: 'flex', flexDirection: 'row' as const },
      box1: { width: '3.5rem', backgroundColor: '#2A52BE', boxShadow: 'none', display: 'block', marginBottom: '0' },
      box2: { width: '3.5rem', backgroundColor: '#E27B58', boxShadow: 'none', display: 'block', marginBottom: '0' },
      box3: { width: '3.5rem', backgroundColor: '#1A1C20', boxShadow: 'none', display: 'block', marginBottom: '0' }
    });

    if (topic === 'display') {
      setDisplayMode('block');
    } else {
      setSliderValue(data.defaultVal);
    }
  };

  const handleStamp = () => {
    setStampActive(true);
    setTimeout(() => setStampActive(false), 600);
    if (navigator.vibrate) navigator.vibrate(30);
  };

  const TopicIcon = currentData.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 pb-4 relative">
      
      {/* Header minimal du cours */}
      <div className="sticky top-0 z-20 bg-gray-50/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-serif text-xl font-bold tracking-tight">DevQuest</span>
          <span className="hidden sm:block bg-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full tracking-widest uppercase">Atelier</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 flex items-center justify-center text-orange-600 dark:text-orange-400 font-medium text-sm">M</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Structure Split Screen */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* COLONNE GAUCHE : Narration */}
          <div className="w-full lg:w-5/12 overflow-y-auto h-auto lg:h-[calc(100vh-140px)] pb-10 lg:pb-0 pr-0 lg:pr-4 space-y-6 scrollbar-hide">
            
            {/* Pills de navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
              {topicKeys.map((key) => {
                const Icon = LESSON_DATA[key].icon;
                return (
                  <button
                    key={key}
                    onClick={() => switchTopic(key)}
                    className={`snap-center shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-200 ${
                      activeTopic === key
                        ? 'border-orange-500 text-orange-600 dark:text-orange-400 bg-white dark:bg-slate-800 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {LESSON_DATA[key].label}
                  </button>
                );
              })}
            </div>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              <span>CSS</span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span className="font-semibold text-slate-600 dark:text-slate-300">{currentData.bcSub}</span>
            </div>

            {/* Titre & description */}
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight mb-4">{currentData.title}</h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-light leading-relaxed max-w-sm mb-6">
              {currentData.desc}
            </p>

            {/* Contenu profond */}
            <div 
              className="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed mb-6 space-y-4"
              dangerouslySetInnerHTML={{ __html: currentData.deep }}
            />

            {/* Zone interactive (Slider ou Radios) */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm mb-6">
              <h2 className="font-serif text-xl font-bold mb-2">{currentData.ctrlTitle}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5" dangerouslySetInnerHTML={{ __html: currentData.ctrlDesc }} />

              {activeTopic === 'display' ? (
                <div className="flex flex-wrap gap-3 mt-2">
                  {['block', 'inline', 'inline-block'].map((mode) => (
                    <label key={mode} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="displayMode"
                        value={mode}
                        checked={displayMode === mode}
                        onChange={(e) => handleDisplayChange(e.target.value)}
                        className="hidden"
                      />
                      <span className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                        displayMode === mode
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:border-orange-300'
                      }`}>
                        {mode === 'inline-block' ? 'Inline-block' : mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 min-w-[24px]">0</span>
                    <input
                      type="range"
                      min="0"
                      max={currentData.sliderMax}
                      value={sliderValue}
                      onChange={(e) => handleSliderChange(Number(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-slate-800 [&::-webkit-slider-thumb]:shadow-md"
                    />
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500 min-w-[30px] text-right">{currentData.sliderMax}{activeTopic === 'size' ? '%' : 'px'}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{currentData.rangeMin}</span>
                    <span id="sliderDisplay" className="font-mono text-orange-600 dark:text-orange-400 font-medium">
                      {currentData.codeValue}
                    </span>
                    <span>{currentData.rangeMax}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Points Clés */}
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
              <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Check className="w-3.5 h-3.5" /> Points Clés
              </h4>
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside pl-2">
                {currentData.keyPoints.map((pt, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: pt }} />
                ))}
              </ul>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{currentData.footerText}</p>

            {/* Bouton Cachet */}
            <button
              onClick={handleStamp}
              className={`group relative inline-flex items-center gap-3 border-2 rounded-full px-6 py-3 bg-white dark:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md ${
                stampActive
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400 scale-95 opacity-80'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-orange-400'
              }`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-colors">
                <path d="M5 22h14M12 22v-4M7 10l5-5 5 5M12 5v6" />
                <circle cx="12" cy="16" r="1" />
              </svg>
              <span className="text-sm font-medium tracking-wide">Apposer mon cachet</span>
            </button>
          </div>

          {/* COLONNE DROITE : Playground (Sticky) */}
          <div className="w-full lg:w-7/12 h-[400px] lg:h-[calc(100vh-140px)] flex flex-col bg-slate-800 rounded-2xl p-4 lg:p-6 shadow-xl sticky top-4 overflow-hidden border border-slate-700">
            
            {/* Header éditeur */}
            <div className="flex items-center justify-between mb-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400/70"></div>
                </div>
                <span className="text-xs font-mono text-slate-500 ml-2">style.css</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono border border-slate-600/50 px-2 py-0.5 rounded">⚡ Live</span>
            </div>

            {/* Code Block */}
            <div className="flex-1 overflow-y-auto editor-scroll font-mono text-xs sm:text-sm leading-[1.8] relative">
              <div className="flex">
                <div className="text-slate-600 select-none w-6 sm:w-8 text-right pr-2 sm:pr-3 shrink-0">
                  <div>1</div><div>2</div><div>3</div><div>4</div><div>5</div>
                </div>
                <div className="text-slate-300">
                  <div className="text-slate-400">.container {`{`}</div>
                  <div className="pl-4 flex items-center gap-2">
                    <span className="text-pink-400">display</span>: <span className="text-yellow-300">flex</span>;
                  </div>
                  <div className="pl-4 flex items-center gap-2 border-l-2 border-orange-500/50 bg-orange-500/5 transition-all duration-300">
                    <span id="codeProp" className="text-pink-400">{currentData.codeProp}</span>: <span id="codeValue" className="text-yellow-300">{currentData.codeValue}</span>;
                  </div>
                  <div className="text-slate-400">{`}`}</div>
                </div>
              </div>
            </div>

            {/* Zone Preview */}
            <div className="mt-4 shrink-0 bg-white dark:bg-slate-200 rounded-xl p-4 shadow-lg border border-slate-600/20 h-[180px] flex items-center justify-center relative overflow-hidden">
              <div 
                id="previewContainer" 
                className="flex w-full h-full items-center justify-center transition-all duration-200"
                style={{ gap: previewStyles.container.gap, display: previewStyles.container.display, flexDirection: previewStyles.container.flexDirection }}
              >
                <div style={{ width: previewStyles.box1.width, backgroundColor: previewStyles.box1.backgroundColor, boxShadow: previewStyles.box1.boxShadow, display: previewStyles.box1.display, marginBottom: previewStyles.box1.marginBottom }} className="rounded-lg shadow-md flex items-center justify-center text-white font-mono text-xs transition-all h-14">1</div>
                <div style={{ width: previewStyles.box2.width, backgroundColor: previewStyles.box2.backgroundColor, boxShadow: previewStyles.box2.boxShadow, display: previewStyles.box2.display, marginBottom: previewStyles.box2.marginBottom }} className="rounded-lg shadow-md flex items-center justify-center text-white font-mono text-xs transition-all h-14">2</div>
                <div style={{ width: previewStyles.box3.width, backgroundColor: previewStyles.box3.backgroundColor, boxShadow: previewStyles.box3.boxShadow, display: previewStyles.box3.display, marginBottom: previewStyles.box3.marginBottom }} className="rounded-lg shadow-md flex items-center justify-center text-white font-mono text-xs transition-all h-14">3</div>
              </div>
              <div className="absolute bottom-2 right-3 text-[10px] text-slate-500 font-mono border border-slate-300/50 px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">preview</div>
            </div>

            {/* Footer éditeur */}
            <div className="mt-3 shrink-0 flex justify-between text-[10px] text-slate-500 font-mono">
              <span>CSS 3.0</span>
              <span>{currentData.codeMode}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Notification Cachet */}
      <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-xl transition-all duration-300 ${
        stampActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium">Cachet apposé avec succès !</span>
        </div>
      </div>

    </div>
  );
}