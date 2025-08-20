import React from 'react';
import Button from '../ui/Button';

interface TimeRangeSelectorProps {
  selectedRange: string;
  onRangeChange: (range: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ selectedRange, onRangeChange }) => {
  const timeRanges = [
    { value: 'short_term', label: '4 Weeks' },
    { value: 'medium_term', label: '6 Months' },
    { value: 'long_term', label: 'All Time' },
  ];

  return (
    <div className="flex space-x-2">
      {timeRanges.map((range) => (
        <Button
          key={range.value}
          variant={selectedRange === range.value ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onRangeChange(range.value)}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
