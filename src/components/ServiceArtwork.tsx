import React from 'react';
import { Armchair, Bike, Check, Clock3, MapPin, ReceiptText, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { ServiceType } from '../types';

/** Small cover compositions built from the same icon family as the ordering UI. */
export const ServiceArtwork: React.FC<{ service: ServiceType }> = ({ service }) => (
  <span className={`service-art service-art-${service}`} aria-hidden="true">
    {service === 'mesa' ? <>
      <span className="service-art-caption">EN EL LOCAL</span>
      <span className="service-art-seat service-art-seat-left"><Armchair /></span>
      <span className="service-art-main"><UtensilsCrossed strokeWidth={1.5} /></span>
      <span className="service-art-seat service-art-seat-right"><Armchair /></span>
      <span className="service-art-ticket">Tu mesa, tu momento</span>
    </> : service === 'takeaway' ? <>
      <span className="service-art-caption">RECOGE Y DISFRUTA</span>
      <span className="service-art-receipt"><ReceiptText strokeWidth={1.5} /></span>
      <span className="service-art-main"><ShoppingBag strokeWidth={1.5} /></span>
      <span className="service-art-seal"><Check strokeWidth={2.5} /></span>
      <span className="service-art-ticket"><Clock3 /> Recién preparado</span>
    </> : <>
      <span className="service-art-caption">HASTA TU PUERTA</span>
      <span className="service-art-pin"><MapPin strokeWidth={1.5} /></span>
      <span className="service-art-main"><Bike strokeWidth={1.5} /></span>
      <span className="service-art-route" />
      <span className="service-art-ticket">El antojo va contigo</span>
    </>}
  </span>
);
