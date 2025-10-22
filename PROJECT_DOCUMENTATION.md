# AI Readiness Survey Application

## Overview

A comprehensive web application that assesses organizational AI readiness across seven key dimensions, providing personalized scoring, maturity level classification, and actionable recommendations for AI transformation.

## Features

### 1. Landing Page
- Professional gradient design (blue-purple-pink)
- Clear value proposition and call-to-action
- Overview of assessment benefits
- Display of 7 assessment dimensions
- Responsive layout for all devices

### 2. Interactive Survey
- 18 carefully crafted questions across 7 dimensions
- Multiple question types:
  - Rating scale (1-5 Likert scale)
  - Multiple choice (single selection)
  - Multiple select (checkbox options)
- Progress indicator showing completion status
- Navigation controls (Previous/Next)
- Dimension badges showing current assessment area
- Responsive design with smooth transitions

### 3. Results & Reporting
- Overall AI Readiness Score (0-100)
- Maturity level classification (4 levels)
- Individual dimension scores with visual progress bars
- Color-coded maturity badges
- Prioritized recommendations (High/Medium/Low)
- Detailed action items for each recommendation
- Downloadable text report

### 4. Assessment Framework

#### Seven Key Dimensions
1. **Business Strategy & Vision** (20% weight)
   - Leadership commitment and strategic alignment
   
2. **Data Foundations** (20% weight)
   - Data quality, availability, and governance
   
3. **Technology Infrastructure** (15% weight)
   - Technical capabilities and system readiness
   
4. **Organization & Culture** (15% weight)
   - Cultural readiness and change management
   
5. **Skills & Talent** (15% weight)
   - Workforce capabilities and training readiness
   
6. **AI Governance & Ethics** (10% weight)
   - Risk management and ethical considerations
   
7. **Implementation Experience** (5% weight)
   - Practical AI adoption experience

#### Maturity Levels
- **Level 1: Awareness** (0-25) - Limited understanding, no clear strategy
- **Level 2: Exploration** (26-50) - Basic understanding, emerging capabilities
- **Level 3: Adoption** (51-75) - Active projects, established governance
- **Level 4: Optimization** (76-100) - Mature integration, continuous improvement

## Technical Stack

- **Framework**: React 19 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **State Management**: React useState with sessionStorage

## Project Structure

```
client/
├── src/
│   ├── pages/
│   │   ├── Home.tsx          # Landing page
│   │   ├── Survey.tsx        # Survey interface
│   │   └── Results.tsx       # Results and recommendations
│   ├── lib/
│   │   ├── surveyData.ts     # Questions and dimensions data
│   │   └── scoring.ts        # Scoring and recommendation logic
│   ├── components/           # Reusable UI components
│   ├── App.tsx              # Main app with routing
│   └── index.css            # Global styles and theme
└── public/                  # Static assets
```

## Key Files

### `surveyData.ts`
Defines the assessment structure including:
- 7 dimension definitions with weights and descriptions
- 18 questions mapped to dimensions
- Question types and options
- Maturity level definitions

### `scoring.ts`
Implements the scoring logic:
- Question score calculation (rating, multiple-choice, multiple-select)
- Weighted dimension scoring
- Overall score calculation
- Maturity level determination
- Recommendation generation based on scores

### Survey Flow
1. User starts on landing page
2. Clicks "Start Assessment" → navigates to `/survey`
3. Answers 18 questions with progress tracking
4. Responses stored in component state
5. On completion, results calculated and stored in sessionStorage
6. User navigated to `/results` page
7. Results displayed with recommendations
8. User can download report as text file

## Scoring Methodology

### Question Scoring
- **Rating questions**: (value - 1) × 25 → converts 1-5 to 0-100
- **Multiple choice**: option_index × 25 → converts 0-4 to 0-100
- **Multiple select**: (selected_count / total_options) × 100

### Dimension Scoring
- Average of all question scores within dimension
- Weighted by question importance (currently all weight = 1)

### Overall Scoring
- Weighted average of dimension scores
- Weights: Strategy (20%), Data (20%), Infrastructure (15%), Culture (15%), Skills (15%), Governance (10%), Experience (5%)

## Recommendation Engine

Recommendations are generated based on:
1. **Priority**: Dimensions sorted by score (lowest first)
   - Top 2 lowest → High Priority
   - Next 2 → Medium Priority
   - Remaining → Low Priority

2. **Content**: Tailored to maturity level
   - Each dimension has 4 recommendation sets (one per maturity level)
   - Includes title, description, and 4 specific action items

## Design System

### Colors
- **Primary**: Blue-purple gradient (oklch(0.55 0.18 264))
- **Backgrounds**: Gradient overlays (blue-50 → purple-50 → pink-50)
- **Maturity Colors**:
  - Red (0-25): Awareness
  - Orange (26-50): Exploration
  - Blue (51-75): Adoption
  - Green (76-100): Optimization

### Typography
- Headings: Bold, large sizes (text-3xl to text-6xl)
- Body: Clean, readable with proper hierarchy
- Icons: Emoji for visual appeal and quick recognition

## Usage Instructions

### Running Locally
```bash
cd ai-readiness-survey
pnpm install
pnpm dev
```

### Accessing the Application
- Development: https://3000-[sandbox-id].manusvm.computer
- Home page: `/`
- Survey: `/survey`
- Results: `/results`

### Taking the Assessment
1. Navigate to home page
2. Click "Start Assessment"
3. Answer all 18 questions
4. Review results and recommendations
5. Download report for future reference

## Future Enhancements

### Potential Improvements
1. **Data Persistence**
   - Save results to database
   - User accounts for tracking progress over time
   - Historical comparison of assessments

2. **Enhanced Reporting**
   - PDF export with charts and graphs
   - Email delivery of reports
   - Benchmark comparison with industry averages

3. **Advanced Features**
   - Industry-specific question sets
   - Custom weighting of dimensions
   - Team/department-level assessments
   - Integration with AI tools for automated recommendations

4. **Analytics**
   - Aggregate anonymous data for insights
   - Trend analysis across organizations
   - Common pain points identification

## Testing

### Manual Testing Completed
✅ Landing page displays correctly
✅ Survey navigation works (Previous/Next)
✅ All question types function properly
✅ Progress bar updates correctly
✅ Responses are captured and stored
✅ Scoring calculation is accurate
✅ Results page displays all information
✅ Recommendations are properly prioritized
✅ Download report functionality works
✅ Responsive design on different screen sizes

### Test Results
- Overall score calculation: ✅ Verified (51/100 for test data)
- Dimension scoring: ✅ All 7 dimensions calculated correctly
- Recommendation generation: ✅ 7 recommendations with proper priority
- Report download: ✅ Text file generated with complete information

## Browser Compatibility

Tested and working on:
- Chrome/Chromium (latest)
- Modern browsers with ES2020+ support

## Performance

- Fast initial load with Vite optimization
- Smooth transitions and interactions
- Minimal dependencies for quick bundle size
- Client-side only (no server required for static deployment)

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Clear labels and descriptions
- High contrast color scheme
- Responsive design for various devices

## License & Credits

Built with industry-standard AI readiness frameworks inspired by:
- Microsoft AI Readiness Assessment
- Deloitte AI Readiness Framework
- MITRE AI Maturity Model
- Various academic and industry research

---

**Version**: 1.0.0  
**Last Updated**: October 17, 2025  
**Status**: Production Ready

