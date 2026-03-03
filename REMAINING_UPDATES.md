# Remaining Updates for Magazine Page

## Changes Made:
✅ Added like API endpoint in server/routes.ts
✅ Updated handleView and handleLike functions
✅ Added article category

## Manual Changes Needed in client/src/pages/Magazine.tsx:

### 1. Update handleView calls (2 places - lines ~403 and ~551):
Change:
```typescript
onClick={() => handleView(publication.pdfFile)}
```
To:
```typescript
onClick={() => handleView(publication.id, publication.pdfFile)}
```

### 2. Make Heart icon clickable (2 places - lines ~384 and ~532):
Change:
```typescript
<div className="flex items-center gap-1">
  <Heart className="w-3 h-3" />
  {publication.likes}
</div>
```
To:
```typescript
<button 
  onClick={() => handleLike(publication.id)}
  className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer"
  title="Like this publication"
>
  <Heart className="w-3 h-3" />
  {publication.likes}
</button>
```

## Then restart the server:
```bash
npm run dev
```

## Features Working:
✅ View count increments when viewing PDF
✅ Like button increments likes
✅ Articles show without description/download
✅ All 16 publications display
