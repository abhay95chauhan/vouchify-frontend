import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface IProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  desc?: string;
  titleSize?: string;
  descClass?: string;
  headerClass?: string;
  cardClass?: string;
  cardContentClass?: string;
  center?: boolean;
  bold?: boolean;
}

const CardComponent = (props: IProps) => {
  return (
    <Card className={props.center ? `mx-auto` : props.cardClass}>
      {(props.title || props.desc) && (
        <CardHeader className={props.headerClass}>
          {props.title && (
            <CardTitle
              className={`text-${props.titleSize || 'xl'} font-${
                props.bold ? 'bold' : 'medium'
              }`}
            >
              {props.title}
            </CardTitle>
          )}
          {props.desc && (
            <CardDescription className={props.descClass}>
              {props.desc}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className={props.cardContentClass}>
        {props.children}
      </CardContent>
    </Card>
  );
};

export default CardComponent;
