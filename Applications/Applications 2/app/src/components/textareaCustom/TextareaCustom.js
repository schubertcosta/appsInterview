import * as React from 'react';
import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';

export default function TextareaCustom(props)  {
  const { 
    customButton, 
    title, 
    isReadOnly, 
    minQtyRows, 
    output, 
    onChange,
    selectDevice } =  props

  return (
    <FormControl>
      <FormLabel>{title}</FormLabel>
      <Textarea
        readOnly = {isReadOnly}
        minRows={minQtyRows ?? 5}
        value = {output}
        endDecorator={
          <Box
            sx={{
              display: 'flex',
              gap: 'var(--Textarea-paddingBlock)',
              pt: 'var(--Textarea-paddingBlock)',
              borderTop: '1px solid',
              borderColor: 'divider',
              flex: 'auto',
            }}
          >
            {selectDevice}
            {customButton}
          </Box>
        }
        onChange={(e) => onChange(e.target.value)}
        sx={{
          minWidth: 300          
        }}
      />
    </FormControl>
  );
}