import React from 'react';

function ContainerTask() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'High':
        return 'text-red-500';
      default:
        return 'text-red-500';
    }
  }
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body d-flex flex-column">
        <div className="flex-grow-1">ContainerTask</div>
      </div>
    </div>
  );
}

export default ContainerTask;
