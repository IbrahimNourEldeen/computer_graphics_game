#include <GL/glut.h>
#include <cmath>
void drawSquare(float w, float h)
{
    glBegin(GL_QUADS);
    glVertex2f(w / 2, h / 2);
    glVertex2f(-w / 2, h / 2);
    glVertex2f(-w / 2, -h / 2);
    glVertex2f(w / 2, -h / 2);
    glEnd();
}
void drowTriangle()
{
    glBegin(GL_TRIANGLES);
    glVertex2f(0.5f, 0.1f);
    glVertex2f(-0.5f, 0.1f);
    glVertex2f(0.0f, -0.4f);
    glEnd();
}
void drawArc(float cx, float cy, float r, float start_angle, float end_angle)
{
    glBegin(GL_TRIANGLE_FAN);
    glVertex2f(cx, cy);
    for (int i = start_angle; i <= end_angle; i++)
    {
        float angle = i * 3.14159f / 180.0f;
        float x = cx + (r * cos(angle));
        float y = cy + (r * sin(angle));
        glVertex2f(x, y);
    }
    glEnd();
}
void display()
{
    glClear(GL_COLOR_BUFFER_BIT);
    glLoadIdentity();

    glColor3f(1.0, 1.0, 1.0);
    glPushMatrix();
    drawSquare(2.0f, 2.0f);
    glPopMatrix();

    glColor3f(0.0, 1.0, 0.0);
    glPushMatrix();
    glTranslatef(0.0f, -0.7f, 0.0f);
    drawSquare(2.0f, 1.0f);
    glPopMatrix();

    glColor3f(0.0, 0.0, 1.0);
    glPushMatrix();
    glTranslatef(0.0f, 0.75f, 0.0f);
    drawSquare(2.0f, 0.6f);
    glPopMatrix();

    glColor3f(98 / 255.0, 62 / 255.0, 26 / 255.0);
    glPushMatrix();
    glTranslatef(0.0f, 0.0f, 0.0f);
    drawSquare(2.0f, 0.5f);
    glPopMatrix();

    for (int i = 0; i < 7; i++)
    {
        glColor3f(0.0, 0.0, 1.0);
        glPushMatrix();
        glTranslatef(-0.8f + i * 0.35f, 0.6f, 0.0f);
        drowTriangle();
        glPopMatrix();
    }

    glColor3f(0.0, 1.0, 0.0);
    glPushMatrix();
    glTranslatef(0.07f, 0.35f, 0.0f);
    drawArc(0.0f, 0.0f, 0.23f, -45, 225);
    glPopMatrix();

    for (int i = 0; i < 4; i++)
    {
        glColor3f(90 / 255.0, 74 / 255.0, 46 / 255.0);
        glPushMatrix();
        glTranslatef(-0.7f + i * 0.35f, -0.2f, 0.0f);
        drawSquare(0.06f, 0.4f);
        glPopMatrix();
    }

    for (int i = 0; i < 4; i++)
    {
        glColor3f(0.0, 1.0, 0.0);
        glPushMatrix();
        glTranslatef(-0.7f + i * 0.35f, 0.0f, 0.0f);
        drawSquare(0.1f, 0.2f);
        glPopMatrix();
    }

    glFlush();
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);

    glutInitWindowSize(1000, 500);
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);
    glutInitWindowPosition(300, 100);
    glutCreateWindow("first");
    glutDisplayFunc(display);
    glutMainLoop();
    return 0;
}
