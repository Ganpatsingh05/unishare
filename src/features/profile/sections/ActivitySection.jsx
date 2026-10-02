"use client"

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { House, Tag, Car, Ticket, MagnifyingGlass, Lightning } from '@phosphor-icons/react';
import { getTimeSince } from '@lib/api/utils';

const TYPE_CONFIG = {
  room: { color: '#1565D8', icon: House, label: 'Listed' },
  item: { color: '#FFC81E', icon: Tag, label: 'Offered' },
  ride: { color: '#16A34A', icon: Car, label: 'Submitted' },
  ticket: { color: '#9333EA', icon: Ticket, label: 'Submitted' },
  lostfound: { color: '#F59E0B', icon: MagnifyingGlass, label: 'Reported' },
};

export default function ActivitySection({ dashboard }) {
  const groupedEvents = useMemo(() => {
    if (!dashboard) return { today: [], yesterday: [], earlier: [] };

    const allEvents = [];

    const processArray = (arr, type) => {
      if (!Array.isArray(arr)) return;
      arr.forEach((item) => {
        allEvents.push({
          id: item.id || Math.random().toString(),
          type,
          action: TYPE_CONFIG[type]?.label || 'Added',
          title: item.title || item.route || item.issue || 'Item',
          timestamp: new Date(item.created_at || Date.now()),
        });
      });
    };

    processArray(dashboard.rooms, 'room');
    processArray(dashboard.items, 'item');
    processArray(dashboard.rides, 'ride');
    processArray(dashboard.tickets, 'ticket');
    processArray(dashboard.lostFound, 'lostfound');

    allEvents.sort((a, b) => b.timestamp - a.timestamp);

    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const groups = { today: [], yesterday: [], earlier: [] };

    allEvents.forEach((event) => {
      const eventDateStr = event.timestamp.toDateString();
      if (eventDateStr === todayStr) {
        groups.today.push(event);
      } else if (eventDateStr === yesterdayStr) {
        groups.yesterday.push(event);
      } else {
        groups.earlier.push(event);
      }
    });

    return groups;
  }, [dashboard]);

  const isEmpty =
    groupedEvents.today.length === 0 &&
    groupedEvents.yesterday.length === 0 &&
    groupedEvents.earlier.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-border-default rounded-xl bg-surface-primary">
        <div className="p-4 rounded-full bg-brand-primary/10 mb-4 text-brand-primary">
          <Lightning size={32} weight="duotone" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">No Recent Activity</h3>
        <p className="text-text-secondary max-w-sm">
          Your activity timeline is empty. Start by sharing a ride, listing an item or posting a room.
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 26 } },
  };

  const renderGroup = (title, events) => {
    if (!events || events.length === 0) return null;
    return (
      <div className="mb-8 last:mb-0">
        <h4 className="text-xs uppercase tracking-widest text-text-muted mb-4 font-semibold">
          {title}
        </h4>
        <div className="flex flex-col space-y-6">
          {events.map((event, index) => {
            const config = TYPE_CONFIG[event.type] || TYPE_CONFIG.item;
            const Icon = config.icon;
            
            return (
              <motion.div variants={itemVariants} key={event.id + index} className="relative flex gap-4 pl-4">
                <div 
                  className="absolute left-0 top-0 bottom-0 w-[2px] -ml-[1px]"
                  style={{ backgroundColor: 'var(--brand-primary)', opacity: 0.2 }}
                />
                
                <div 
                  className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full -ml-[5px] border-2 border-surface-primary"
                  style={{ backgroundColor: config.color }}
                />

                <div className="flex items-start gap-3 w-full bg-surface-primary p-3 rounded-lg border border-border-default shadow-sm">
                  <div 
                    className="p-2 rounded-md" 
                    style={{ backgroundColor: `${config.color}15`, color: config.color }}
                  >
                    <Icon size={20} weight="fill" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium truncate">
                      <span className="text-text-secondary font-normal mr-1">{event.action}</span>
                      {event.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {getTimeSince(event.timestamp.toISOString())}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="max-w-2xl"
    >
      {renderGroup('Today', groupedEvents.today)}
      {renderGroup('Yesterday', groupedEvents.yesterday)}
      {renderGroup('Earlier', groupedEvents.earlier)}
    </motion.div>
  );
}
