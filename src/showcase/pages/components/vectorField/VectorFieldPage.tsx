import { ExampleBlock } from '@/showcase/template/ExampleBlock';
import { PageSection } from '@/showcase/template/PageSection';
import { VectorFieldCustomAxesExample } from './VectorFieldCustomAxesExample';
import customAxesStyles from './VectorFieldCustomAxesExample.module.css?raw';
import customAxesSource from './VectorFieldCustomAxesExample.tsx?raw';
import { VectorFieldMixedExample } from './VectorFieldMixedExample';
import mixedStyles from './VectorFieldMixedExample.module.css?raw';
import mixedSource from './VectorFieldMixedExample.tsx?raw';
import { VectorFieldTransformExample } from './VectorFieldTransformExample';
import transformStyles from './VectorFieldTransformExample.module.css?raw';
import transformSource from './VectorFieldTransformExample.tsx?raw';

export function VectorFieldPage() {
  return (
    <>
      <PageSection title="Several numbers in one row">
        <p>
          A vector field shows several numbers side by side, each with an axis caption: position,
          rotation and scale in a transform. <code>axes</code> lists the captions;{' '}
          <code>VECTOR2_AXES</code>, <code>VECTOR3_AXES</code> and <code>VECTOR4_AXES</code> give X,
          Y, Z and W. The axis letters are not translated, like key names. X, Y and Z carry a
          colored mark from the <code>axis-*</code> tokens; the caption text keeps the text color.
        </p>
        <p>
          <code>value</code> is an array with one number per axis, and{' '}
          <code>onValueChange(value, phase)</code> receives the whole vector with one component
          replaced. Every component is a number field and keeps its protocol: typing and Enter
          commit once, and dragging an axis caption previews and commits once. The owner writes the
          vector as it is, and an undo stack records one entry per edit of one component.
        </p>
        <p>
          In a property row, pass <code>id</code> and <code>aria-labelledby</code> from the row:{' '}
          <code>id</code> goes to the first component, so a click on the row caption focuses X, and
          screen readers read every component as &quot;Position X&quot;. Without a row, name the
          field with <code>aria-label</code>. Every component is its own Tab stop, from left to
          right.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'VectorFieldTransformExample.tsx', code: transformSource },
            { fileName: 'VectorFieldTransformExample.module.css', code: transformStyles },
          ]}
        >
          <VectorFieldTransformExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Integers and own axes">
        <p>
          <code>kind</code>, <code>min</code>, <code>max</code>, <code>step</code>,{' '}
          <code>precision</code> and <code>invalidMessages</code> work as in the number field and
          apply to all components. Axes may have any captions and may go without a mark, as U and V
          of a texture tiling below.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'VectorFieldCustomAxesExample.tsx', code: customAxesSource },
            { fileName: 'VectorFieldCustomAxesExample.module.css', code: customAxesStyles },
          ]}
        >
          <VectorFieldCustomAxesExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Mixed components">
        <p>
          <code>mixed</code> is an array of flags, one per component: several selected objects may
          share Y and differ in X and Z. A mixed component shows a dash and is edited like any
          other; the owner decides when it stops being mixed.
        </p>
        <ExampleBlock
          sources={[
            { fileName: 'VectorFieldMixedExample.tsx', code: mixedSource },
            { fileName: 'VectorFieldMixedExample.module.css', code: mixedStyles },
          ]}
        >
          <VectorFieldMixedExample />
        </ExampleBlock>
      </PageSection>
      <PageSection title="Other props">
        <p>
          <code>disabled</code> and <code>readOnly</code> apply to all components and turn off
          dragging. <code>infiniteDrag</code> locks the pointer while an axis caption is dragged, as{' '}
          <code>infinite</code> in value drag. <code>size</code> sets the height of the fields, and{' '}
          <code>className</code> goes to the outer element for layout. Linking proportions of the
          components, as the scale lock in Godot and Unreal, is not supported yet.
        </p>
      </PageSection>
    </>
  );
}
