'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  Pen,
  X,
  ClipboardPaste,
  ChevronDown,
  ChevronUp,
  Languages,
} from 'lucide-react';
import { usePoems, type Poem } from '@/hooks/usePoems';

type Author = 'nikita' | 'shubham';
type Language = 'english' | 'hindi';

/* ─── Compose / Edit Modal ─── */
function PoemFormModal({
  author,
  editingPoem,
  onClose,
  onSave,
}: {
  author: Author;
  editingPoem?: Poem | null;
  onClose: () => void;
  onSave: (data: {
    title: string;
    content: string;
    language: Language;
  }) => void;
}) {
  const [title, setTitle] = useState(editingPoem?.title ?? '');
  const [content, setContent] = useState(editingPoem?.content ?? '');
  const [language, setLanguage] = useState<Language>(
    editingPoem?.language ?? 'english',
  );

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setContent((prev) => (prev ? prev + '\n' + text : text));
    } catch {
      /* clipboard permission denied – ignore */
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) return;
    onSave({ title: title.trim(), content: content.trim(), language });
  };

  const displayName = author === 'nikita' ? 'Nikita' : 'Shubham';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-2xl p-5 max-h-[85dvh] overflow-y-auto animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold">
            {editingPoem ? 'Edit' : 'New'} Poem — {displayName}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your poem a name…"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-light outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all mb-3"
        />

        {/* Language toggle */}
        <div className="flex items-center gap-2 mb-3">
          <Languages size={14} className="text-muted" />
          <div className="flex rounded-lg border border-border overflow-hidden text-xs">
            <button
              onClick={() => setLanguage('english')}
              className={`px-3 py-1.5 transition-all ${
                language === 'english'
                  ? 'bg-accent text-white'
                  : 'bg-card text-muted hover:text-foreground'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hindi')}
              className={`px-3 py-1.5 transition-all ${
                language === 'hindi'
                  ? 'bg-accent text-white'
                  : 'bg-card text-muted hover:text-foreground'
              }`}
            >
              Hindi
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              language === 'hindi'
                ? 'यहाँ अपनी कविता लिखें…'
                : 'Write your poetry here…'
            }
            rows={8}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-light outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all resize-none leading-relaxed"
          />
          <button
            onClick={handlePaste}
            title="Paste from clipboard"
            className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-accent-soft text-accent hover:bg-accent hover:text-white transition-all"
          >
            <ClipboardPaste size={14} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim()}
            className="flex-1 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white shadow-sm active:scale-[0.98] transition-all disabled:opacity-40"
          >
            {editingPoem ? 'Save Changes' : 'Add Poem'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Poem Card ─── */
function PoemCard({
  poem,
  onEdit,
  onDelete,
}: {
  poem: Poem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = poem.content.length > 200;
  const displayContent =
    isLong && !expanded ? poem.content.slice(0, 200) + '…' : poem.content;

  return (
    <div className="rounded-xl bg-card border border-border p-4 shadow-sm animate-fade-in-up">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-semibold text-sm truncate">
            {poem.title}
          </h4>
          <span className="inline-block mt-1 text-[0.6rem] uppercase tracking-widest font-medium px-2 py-0.5 rounded-full bg-accent-soft text-accent">
            {poem.language}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-muted hover:text-accent transition-colors"
          >
            <Pen size={13} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-muted-light hover:text-red-400 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-card-foreground/80 leading-relaxed whitespace-pre-line">
        {displayContent}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-2 text-xs text-accent font-medium"
        >
          {expanded ? (
            <>
              Show less <ChevronUp size={12} />
            </>
          ) : (
            <>
              Read more <ChevronDown size={12} />
            </>
          )}
        </button>
      )}

      {/* Date */}
      <p className="text-[0.6rem] text-muted mt-3">
        {new Date(poem.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}

/* ─── Author Section ─── */
function AuthorSection({
  author,
  displayName,
  poems,
  onAdd,
  onEdit,
  onDelete,
}: {
  author: Author;
  displayName: string;
  poems: Poem[];
  onAdd: () => void;
  onEdit: (poem: Poem) => void;
  onDelete: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <section className="animate-fade-in-up">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 group"
        >
          <h3 className="text-base font-display font-bold tracking-tight">
            {displayName}&apos;s Catalog
          </h3>
          <span className="text-xs text-muted bg-accent-soft rounded-full px-2 py-0.5">
            {poems.length}
          </span>
          {collapsed ? (
            <ChevronDown
              size={14}
              className="text-muted group-hover:text-foreground transition-colors"
            />
          ) : (
            <ChevronUp
              size={14}
              className="text-muted group-hover:text-foreground transition-colors"
            />
          )}
        </button>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg bg-accent/10 text-accent px-3 py-1.5 text-xs font-medium hover:bg-accent hover:text-white transition-all active:scale-95"
        >
          <Plus size={14} strokeWidth={2.5} />
          Write
        </button>
      </div>

      {/* Poems list */}
      {!collapsed && (
        <div className="space-y-3">
          {poems.length === 0 ? (
            <div className="text-center py-8 rounded-xl border border-dashed border-border">
              <p className="text-sm text-muted">
                No poems yet — tap Write to begin
              </p>
            </div>
          ) : (
            poems.map((poem) => (
              <PoemCard
                key={poem.id}
                poem={poem}
                onEdit={() => onEdit(poem)}
                onDelete={() => onDelete(poem.id)}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
}

/* ─── Main Component ─── */
export default function PoetryCatalog() {
  const { loaded, addPoem, updatePoem, removePoem, poemsByAuthor } =
    usePoems();

  const [modalState, setModalState] = useState<{
    open: boolean;
    author: Author;
    editing: Poem | null;
  }>({ open: false, author: 'nikita', editing: null });

  const openAdd = (author: Author) =>
    setModalState({ open: true, author, editing: null });

  const openEdit = (poem: Poem) =>
    setModalState({ open: true, author: poem.author, editing: poem });

  const closeModal = () =>
    setModalState({ open: false, author: 'nikita', editing: null });

  const handleSave = async (data: {
    title: string;
    content: string;
    language: Language;
  }) => {
    if (modalState.editing) {
      await updatePoem(modalState.editing.id, data);
    } else {
      await addPoem({ ...data, author: modalState.author });
    }
    closeModal();
  };

  if (!loaded) return null;

  const nikitaPoems = poemsByAuthor('nikita');
  const shubhamPoems = poemsByAuthor('shubham');

  return (
    <div className="px-6 py-8 pb-4">
      {/* Page header */}
      <div className="mb-6 animate-fade-in-up">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent mb-1.5">
          Words & Verses
        </p>
        <h2 className="text-2xl font-display font-bold tracking-tight">
          Poetry Catalog
        </h2>
        <p className="text-sm text-muted mt-1">
          {nikitaPoems.length + shubhamPoems.length} poem
          {nikitaPoems.length + shubhamPoems.length !== 1 ? 's' : ''} written
          together
        </p>
      </div>

      {/* Two sections */}
      <div className="space-y-8">
        <AuthorSection
          author="nikita"
          displayName="Nikita"
          poems={nikitaPoems}
          onAdd={() => openAdd('nikita')}
          onEdit={openEdit}
          onDelete={removePoem}
        />

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[0.6rem] uppercase tracking-widest text-muted">
            &hearts;
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <AuthorSection
          author="shubham"
          displayName="Shubham"
          poems={shubhamPoems}
          onAdd={() => openAdd('shubham')}
          onEdit={openEdit}
          onDelete={removePoem}
        />
      </div>

      {/* Modal */}
      {modalState.open && (
        <PoemFormModal
          author={modalState.author}
          editingPoem={modalState.editing}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
