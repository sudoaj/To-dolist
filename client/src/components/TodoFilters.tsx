import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Todo } from "@shared/schema";

interface TodoFiltersProps {
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

export default function TodoFilters({ onFilterChange }: TodoFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');

  const { data: todos = [] } = useQuery<Todo[]>({
    queryKey: ["/api/todos"],
    retry: false,
  });

  const allCount = todos.length;
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  const handleFilterChange = (filter: 'all' | 'active' | 'completed') => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => handleFilterChange('all')}
              className="rounded-full"
            >
              All ({allCount})
            </Button>
            <Button
              variant={activeFilter === 'active' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => handleFilterChange('active')}
              className="rounded-full"
            >
              Active ({activeCount})
            </Button>
            <Button
              variant={activeFilter === 'completed' ? 'default' : 'secondary'}
              size="sm"
              onClick={() => handleFilterChange('completed')}
              className="rounded-full"
            >
              Completed ({completedCount})
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
