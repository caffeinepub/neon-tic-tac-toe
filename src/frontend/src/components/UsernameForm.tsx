import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Check } from 'lucide-react';
import { useUsername } from '@/hooks/useUsername';

export function UsernameForm() {
  const { username, saveUsername, isValid } = useUsername();
  const [inputValue, setInputValue] = useState(username);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (isValid(inputValue)) {
      saveUsername(inputValue);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid(inputValue)) {
      handleSave();
    }
  };

  return (
    <Card className="border-neon-blue/30 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-neon-blue flex items-center gap-2">
          <User className="w-5 h-5" />
          Player Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username" className="text-sm text-muted-foreground">
            Username
          </Label>
          <div className="flex gap-2">
            <Input
              id="username"
              type="text"
              placeholder="Enter your name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={20}
              className="border-neon-blue/30 focus:border-neon-blue bg-background/50"
            />
            <Button
              onClick={handleSave}
              disabled={!isValid(inputValue) || inputValue === username}
              className="bg-neon-blue hover:bg-neon-blue/90 text-white border-0"
            >
              {showSuccess ? <Check className="w-4 h-4" /> : 'Save'}
            </Button>
          </div>
          {inputValue.trim() && !isValid(inputValue) && (
            <p className="text-xs text-destructive">
              Username must be 1-20 characters
            </p>
          )}
          {username && (
            <p className="text-xs text-muted-foreground">
              Wins will be recorded as: <span className="text-neon-blue font-medium">{username}</span>
            </p>
          )}
          {!username && (
            <p className="text-xs text-muted-foreground">
              Set a username to track your wins!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
