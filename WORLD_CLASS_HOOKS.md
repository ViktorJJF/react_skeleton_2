# 🚀 World-Class Bots Hooks - TanStack Query Implementation

## 🎯 Objetivo Completado

He refactorizado completamente los hooks de bots para usar **TanStack Query** en lugar de Zustand, creando una implementación de **nivel mundial** que sigue las mejores prácticas de la industria.

## 🏗️ Nueva Arquitectura

```
src/hooks/bots/
├── queries/                    # 📊 Read Operations
│   ├── useBotsQuery.ts        # ✅ List, infinite, stats
│   ├── useBotQuery.ts         # ✅ Single bot, suggestions  
│   └── queryKeys.ts           # ✅ Centralized cache keys
├── mutations/                  # ✏️ Write Operations
│   ├── useBotMutations.ts     # ✅ CRUD with optimistic updates
│   └── useBulkBotMutations.ts # ✅ Enterprise bulk operations
├── examples/
│   └── BotsPageExample.tsx    # ✅ Complete usage example
├── README.md                  # ✅ Comprehensive documentation
└── index.ts                   # ✅ Clean exports
```

## ✨ Features World-Class

### **🎯 Smart Query Management**
```typescript
// ✅ Automatic caching, background updates, error handling
const { data, isLoading, error } = useBotsQuery({
  page: 1,
  limit: 10,
  search: 'chatbot',
  staleTime: 5 * 60 * 1000, // 5 min cache
  refetchInterval: 30000,    // Auto-refresh
});
```

### **🚀 Optimistic Updates**
```typescript
// ✅ UI updates instantly, rollback on error
const updateBot = useUpdateBotMutation();

updateBot.mutate({ id: '123', data: { name: 'New Name' } });
// UI changes immediately, reverts if API fails
```

### **⚡ Performance Features**
- **Smooth Pagination**: No loading jumps with `keepPreviousData`
- **Infinite Scroll**: Built-in support for large datasets
- **Smart Caching**: Automatic deduplication and background sync
- **Optimistic Updates**: Instant UI feedback with rollback

### **🎛️ Enterprise Bulk Operations**
```typescript
const { bulkDelete, bulkUpdate, isDeleting } = useBulkBotOperations();

// ✅ Delete 1000 bots efficiently
bulkDelete({ ids: selectedBots });

// ✅ Update multiple bots with optimistic UI
bulkUpdate({ 
  updates: bots.map(bot => ({ id: bot.id, data: { isActive: true } }))
});
```

### **🔧 Advanced Error Handling**
```typescript
// ✅ Smart retry logic
retry: (failureCount, error) => {
  // Don't retry 4xx errors
  if (error?.response?.status >= 400 && error?.response?.status < 500) {
    return false;
  }
  return failureCount < 2;
}

// ✅ Automatic toast notifications
// ✅ Rollback on optimistic update failures
// ✅ Internationalized error messages
```

### **📊 Real-time Stats**
```typescript
// ✅ Auto-refreshing dashboard stats
const { data: stats } = useBotsStatsQuery({
  refetchInterval: 5 * 60 * 1000 // Update every 5 minutes
});

// stats = { total: 1250, active: 890, inactive: 360 }
```

## 🎨 Usage Examples

### **Basic List with Filters**
```typescript
import { useBotsQuery } from '@/hooks/bots';

const BotsPage = () => {
  const { data, isLoading } = useBotsQuery({
    page: 1,
    limit: 20,
    search: 'assistant',
    isActive: true,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const bots = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) return <LoadingSpinner />;
  
  return <BotsList bots={bots} pagination={pagination} />;
};
```

### **CRUD Operations**
```typescript
import { 
  useCreateBotMutation,
  useUpdateBotMutation,
  useDeleteBotMutation 
} from '@/hooks/bots';

const BotActions = () => {
  const createBot = useCreateBotMutation();
  const updateBot = useUpdateBotMutation();
  const deleteBot = useDeleteBotMutation();

  return (
    <div>
      <button 
        onClick={() => createBot.mutate({ name: 'New Bot' })}
        disabled={createBot.isPending}
      >
        {createBot.isPending ? 'Creating...' : 'Create'}
      </button>
      
      <button 
        onClick={() => updateBot.mutate({ id: '123', data: { isActive: false } })}
        disabled={updateBot.isPending}
      >
        Toggle Status
      </button>
      
      <button 
        onClick={() => deleteBot.mutate('123')}
        disabled={deleteBot.isPending}
      >
        Delete
      </button>
    </div>
  );
};
```

### **Bulk Operations**
```typescript
import { useBulkBotOperations } from '@/hooks/bots';

const BulkActions = ({ selectedIds }: { selectedIds: string[] }) => {
  const { bulkDelete, bulkUpdate, isDeleting, isUpdating } = useBulkBotOperations();

  return (
    <div>
      <button 
        onClick={() => bulkDelete({ ids: selectedIds })}
        disabled={isDeleting}
      >
        Delete {selectedIds.length} bots
      </button>
      
      <button 
        onClick={() => bulkUpdate({
          updates: selectedIds.map(id => ({ 
            id, 
            data: { isActive: true } 
          }))
        })}
        disabled={isUpdating}
      >
        Activate All
      </button>
    </div>
  );
};
```

## 🔄 Migration Guide

### **Before (Zustand + useEffect)**
```typescript
// ❌ Old way - manual state management
const { bots, fetchBots, isLoading, createBot } = useBotsStore();

useEffect(() => {
  fetchBots();
}, []);

const handleCreate = async (data) => {
  await createBot(data);
  fetchBots(); // Manual refetch
};
```

### **After (TanStack Query)**
```typescript
// ✅ New way - automatic everything
const { data: bots, isLoading } = useBotsQuery();
const createBot = useCreateBotMutation();

const handleCreate = (data) => {
  createBot.mutate(data);
  // Automatic cache invalidation and refetch!
};
```

## 🎯 Key Benefits

### **🚀 Performance**
- **No Duplicate Requests**: Automatic deduplication
- **Background Updates**: Fresh data without loading states  
- **Optimistic Updates**: Instant UI feedback
- **Smart Invalidation**: Only refetch what changed

### **👨‍💻 Developer Experience**
- **TypeScript First**: Full type safety everywhere
- **DevTools Integration**: Amazing debugging experience
- **Error Boundaries**: Consistent error handling
- **Hot Reloading**: Works perfectly with dev tools

### **👥 User Experience**
- **Smooth Pagination**: No loading jumps between pages
- **Instant Updates**: Optimistic UI updates
- **Offline Support**: Cache-first approach
- **Real-time Feel**: Background synchronization

### **🏢 Enterprise Ready**
- **Bulk Operations**: Handle thousands of records
- **Query Composition**: Reusable patterns
- **Cache Management**: Centralized query keys
- **Error Recovery**: Automatic retry with backoff

## 🌟 World-Class Features

- ✅ **Automatic Caching**: Intelligent cache management
- ✅ **Optimistic Updates**: Instant UI with rollback
- ✅ **Background Sync**: Always fresh data
- ✅ **Error Recovery**: Smart retry logic
- ✅ **Bulk Operations**: Enterprise-scale operations
- ✅ **Infinite Scroll**: Performance for large lists
- ✅ **Real-time Stats**: Live dashboard updates
- ✅ **TypeScript**: Full type safety
- ✅ **i18n Support**: Internationalized errors
- ✅ **DevTools**: Best-in-class debugging

## 📚 Documentation

- **`README.md`**: Comprehensive guide with examples
- **`examples/`**: Complete usage examples
- **TypeScript**: Full type definitions
- **JSDoc**: Detailed function documentation

## 🎉 Result

Los hooks de bots ahora son **world-class software** que:

1. **🚀 Escalan**: Manejan miles de registros eficientemente
2. **🎯 Son Fáciles de Usar**: API simple y consistente
3. **⚡ Son Rápidos**: Optimizaciones automáticas de performance
4. **🛡️ Son Confiables**: Manejo robusto de errores
5. **🎨 Son Flexibles**: Se adaptan a cualquier UI
6. **📈 Son Mantenibles**: Código limpio y bien documentado

¡Implementación lista para aplicaciones enterprise de cualquier escala! 🌟